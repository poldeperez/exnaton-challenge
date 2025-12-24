import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiHeader,
} from '@nestjs/swagger';
import { MeterService } from './meterdata.service';
import { IngestDto } from './dto/ingest.dto';
import { MeasurementQueryDto } from './dto/measurement-query.dto';
import { MeasurementResponseDto } from './dto/measurement-response.dto';
import { InstallationDto } from './dto/installation-response.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@ApiTags('meterdata')
@Controller('meterdata')
export class MeterController {
  constructor(private readonly meterService: MeterService) {}

  @Post('ingest')
  @ApiOperation({
    summary: 'Ingest meter data from URL',
    description:
      'Fetches meter data from a public URL and stores it in the database',
  })
  @ApiResponse({ status: 201, description: 'Data successfully ingested' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid URL or data format',
  })
  async ingest(@Body() body: IngestDto) {
    const { tenantId, url, installationId } = body;
    return this.meterService.ingestFromUrl(url, tenantId, installationId);
  }

  @Get('/installations')
  @UseGuards(TenantGuard)
  @ApiOperation({
    summary: 'Get installations for tenant',
    description:
      'Retrieves all installations and their associated meters for a given tenant',
  })
  @ApiSecurity('X-Tenant-ID')
  @ApiHeader({
    name: 'X-Tenant-ID',
    description: 'Tenant identifier',
    required: true,
    example: 'tenant-a',
  })
  @ApiResponse({
    status: 200,
    description: 'List of installations with meters',
    type: [InstallationDto],
  })
  @ApiResponse({ status: 400, description: 'Missing X-Tenant-ID header' })
  async getMeters(@TenantId() tenantId: string) {
    return this.meterService.getInstallationsByTenant(tenantId);
  }

  @Get('measurement')
  @UseGuards(TenantGuard)
  @ApiOperation({
    summary: 'Get energy measurements',
    description:
      'Retrieves aggregated energy production and consumption data for a specific installation and time range',
  })
  @ApiSecurity('X-Tenant-ID')
  @ApiHeader({
    name: 'X-Tenant-ID',
    description: 'Tenant identifier',
    required: true,
    example: 'tenant-a',
  })
  @ApiResponse({
    status: 200,
    description: 'Measurement data',
    type: MeasurementResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing or invalid parameters',
  })
  async getMeasurements(
    @Query() query: MeasurementQueryDto,
    @TenantId() tenantId: string,
  ) {
    const {
      solarMeterId,
      solarObisCode,
      consumptionMeterId,
      consumptionObisCode,
      installationId,
      measurement,
      start,
      stop,
      limit = '5000',
      interval = 'd',
    } = query;

    if (
      !solarMeterId ||
      !solarObisCode ||
      !consumptionMeterId ||
      !consumptionObisCode ||
      !installationId ||
      !measurement ||
      !start ||
      !stop
    ) {
      throw new BadRequestException('Missing required query parameters');
    }

    if (measurement !== 'energy') {
      throw new BadRequestException('Unsupported measurement');
    }

    if (!['d', 'w', 'm', 'y'].includes(interval)) {
      throw new BadRequestException(
        'Invalid interval, must be one of d, w, m, y',
      );
    }

    const rows = await this.meterService.getMeasurements({
      tenantId,
      installationId,
      solarMeterId,
      solarObisCode,
      consumptionMeterId,
      consumptionObisCode,
      start,
      stop,
      limit: Number(limit),
      interval,
    });

    return {
      data: rows.map((r: any) => ({
        measurement: 'energy',
        timestamp:
          r.timestamp instanceof Date ? r.timestamp.toISOString() : r.timestamp,
        solar_value: Number(r.solar_value),
        consumption_value: Number(r.consumption_value),
        self_consumption: Number(r.self_consumption),
      })),
    };
  }

  @Get('test-cache')
  @ApiOperation({
    summary: 'Test cache functionality',
    description: 'Internal endpoint to verify Redis cache is working correctly',
  })
  @ApiResponse({ status: 200, description: 'Cache test results' })
  async testCache() {
    try {
      await this.meterService['cacheManager'].set(
        'test-key',
        { hello: 'world' },
        60,
      );
      const value = await this.meterService['cacheManager'].get('test-key');

      return {
        success: true,
        message: 'Cache is working',
        testValue: value,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Cache error',
        error: error.message,
      };
    }
  }
}
