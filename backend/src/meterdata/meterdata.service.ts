import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { MeterReading } from './meterdata.entity';

@Injectable()
export class MeterService {
  constructor(
    @InjectRepository(MeterReading)
    private readonly repo: Repository<MeterReading>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async ingestFromJson(data: any[], tenantId: string, installationId: string) {
    const readings = data.map((r) => {
      // Determine which OBIS code is present and get its value
      const obisCode =
        r['0100021D00FF'] !== undefined ? '0100021D00FF' : '0100011D00FF';
      const rawValue = r[obisCode];

      const value = Number(rawValue);
      if (Number.isNaN(value)) {
        throw new Error(`Invalid meter value: ${JSON.stringify(rawValue)}`);
      }

      return {
        tenantId,
        installationId,
        meterId: r.tags.muid,
        obisCode,
        timestamp: new Date(r.timestamp),
        value,
        quality: r.tags.quality,
      };
    });

    const result = this.repo.save(readings);

    await this.cacheManager.del(`meterdata:${tenantId}:${installationId}:*`);
    await this.cacheManager.del(`installations:${tenantId}`);

    return result;
  }

  async ingestFromUrl(url: string, tenantId: string, installationId: string) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch meter data from ${url}: ${response.status} ${response.statusText}`,
      );
    }

    const json = await response.json();
    if (!json || !Array.isArray(json.data)) {
      throw new Error('Invalid meter data format: expected { data: [...] }');
    }

    return this.ingestFromJson(json.data, tenantId, installationId);
  }

  async getInstallationsByTenant(tenantId: string) {
    const cacheKey = `installations:${tenantId}`;

    // Check cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Cache hit:', cacheKey);
      return cached;
    }
    
    const results = await this.repo
      .createQueryBuilder('r')
      .select('r.installationId', 'id')
      .addSelect('COUNT(DISTINCT r.meterId)', 'meterCount')
      .where('r.tenantId = :tenantId', { tenantId })
      .groupBy('r.installationId')
      .orderBy('r.installationId', 'ASC')
      .getRawMany();

    // For each installation, get its meters with OBIS codes
    const installationsWithMeters = await Promise.all(
      results.map(async (r) => {
        const meters = await this.repo
          .createQueryBuilder('r')
          .select('r.meterId', 'meterId')
          .addSelect('r.obisCode', 'obisCode')
          .where('r.tenantId = :tenantId', { tenantId })
          .andWhere('r.installationId = :installationId', { installationId: r.id })
          .groupBy('r.meterId')
          .addGroupBy('r.obisCode')
          .getRawMany();

        const name = r.id
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          id: r.id,
          name,
          meterCount: Number(r.meterCount),
          meters: meters.map((m) => ({
            meterId: m.meterId,
            obisCode: m.obisCode,
          })),
        };
      }),
    );

    await this.cacheManager.set(cacheKey, installationsWithMeters, 900000); // 15 minutes in milliseconds (900 * 1000)

    return installationsWithMeters;
  }

  async getMeasurements({
    tenantId,
    installationId,
    solarMeterId,
    solarObisCode,
    consumptionMeterId,
    consumptionObisCode,
    start,
    stop,
    limit,
    interval,
  }: {
    tenantId: string;
    installationId: string;
    solarMeterId: string;
    solarObisCode: string;
    consumptionMeterId: string;
    consumptionObisCode: string;
    start: string;
    stop: string;
    limit: number;
    interval: 'd' | 'w' | 'm' | 'y';
  }) {
    const cacheKey = `meterdata:${tenantId}:${installationId}:${start}:${stop}:${interval}`;

    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        console.log('Cache HIT:', cacheKey);
        
        // Normalize cached data
        return Array.isArray(cached) 
            ? cached.map(item => ({
                ...item,
                timestamp: typeof item.timestamp === 'string' 
                    ? new Date(item.timestamp) 
                    : item.timestamp
              }))
            : cached;
      }
      console.log('Cache MISS:', cacheKey);
    } catch (error) {
      console.error('Cache GET error:', error);
    }

    const bucketExpr =
      interval === 'y'
        ? `date_trunc('month', timestamp)`
        : interval === 'd'
        ? `timestamp`
        : `date_trunc('day', timestamp)`; // week and month

    const query = `
      SELECT
        ${bucketExpr} AS timestamp,
        SUM(solar_value) AS solar_value,
        SUM(consumption_value) AS consumption_value,
        SUM(self_consumption) AS self_consumption
      FROM (
        SELECT
          "timestamp",
          SUM(CASE WHEN "meterId" = $1 AND "obisCode" = $2 THEN "value" ELSE 0 END) AS solar_value,
          SUM(CASE WHEN "meterId" = $3 AND "obisCode" = $4 THEN "value" ELSE 0 END) AS consumption_value,
          LEAST(
            SUM(CASE WHEN "meterId" = $1 AND "obisCode" = $2 THEN "value" ELSE 0 END),
            SUM(CASE WHEN "meterId" = $3 AND "obisCode" = $4 THEN "value" ELSE 0 END)
          ) AS self_consumption
        FROM meter_readings
        WHERE "tenantId" = $5
          AND "installationId" = $6
          AND (
            ("meterId" = $1 AND "obisCode" = $2) OR
            ("meterId" = $3 AND "obisCode" = $4)
          )
          AND "timestamp" >= $7
          AND "timestamp" <= $8
        GROUP BY "timestamp"
      ) sub
      GROUP BY ${bucketExpr}
      ORDER BY ${bucketExpr} ASC
      LIMIT $9
    `;

    const result = await this.repo.query(query, [
      solarMeterId,
      solarObisCode,
      consumptionMeterId,
      consumptionObisCode,
      tenantId,
      installationId,
      start,
      stop,
      limit,
    ]);

    try {
      const ttl = 3600000; // 1 hour in milliseconds (3600 * 1000)
      await this.cacheManager.set(cacheKey, result, ttl);
      console.log('Cached result with key:', cacheKey, 'TTL:', ttl);
      
    } catch (error) {
      console.error('Cache SET error:', error);
    }

    return result;
  }
}
