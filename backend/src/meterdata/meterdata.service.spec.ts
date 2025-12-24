import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { MeterService } from './meterdata.service';
import { MeterReading } from './meterdata.entity';

describe('MeterService', () => {
  let service: MeterService;
  let repository: Repository<MeterReading>;
  let cacheManager: Cache;
  let httpService: HttpService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
    query: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
    axiosRef: {
      get: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeterService,
        {
          provide: getRepositoryToken(MeterReading),
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<MeterService>(MeterService);
    repository = module.get<Repository<MeterReading>>(
      getRepositoryToken(MeterReading),
    );
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    httpService = module.get<HttpService>(HttpService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getInstallationsByTenant', () => {
    const tenantId = 'tenant-a';
    const cacheKey = `installations:${tenantId}`;

    it('should return cached data if available', async () => {
      const cachedData = [
        {
          installationId: 'installation-1',
          meters: [
            {
              meterId: 'meter-001',
              obisCodes: ['0100011D00FF'],
            },
          ],
        },
      ];

      mockCacheManager.get.mockResolvedValue(cachedData);

      const result = await service.getInstallationsByTenant(tenantId);

      expect(result).toEqual(cachedData);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if not in cache', async () => {
      // First query returns installations
      const installationData = [
        {
          id: 'installation-1',
          installationId: 'installation-1',
          meterCount: '1',
        },
      ];

      // Second query (nested) returns meters for each installation
      const meterData = [
        {
          meterId: 'meter-001',
          obisCode: '0100011D00FF',
        },
      ];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockResolvedValueOnce(installationData)
          .mockResolvedValueOnce(meterData),
      };

      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getInstallationsByTenant(tenantId);

      expect(result).toBeDefined();
      expect(result).toEqual([
        {
          id: 'installation-1',
          name: 'Installation 1',
          meterCount: 1,
          meters: [
            {
              meterId: 'meter-001',
              obisCode: '0100011D00FF',
            },
          ],
        },
      ]);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('getMeasurements', () => {
    const params: Parameters<typeof service.getMeasurements>[0] = {
      tenantId: 'test-tenant',
      installationId: 'installation-1',
      solarMeterId: 'solar-meter',
      solarObisCode: '0100021D00FF',
      consumptionMeterId: 'consumption-meter',
      consumptionObisCode: '0100010800FF',
      start: '2023-02-01T00:00:00.000Z',
      stop: '2024-02-01T23:59:59.999Z',
      limit: 100,
      interval: 'd',
    };

    it('should return measurements with self-consumption calculation', async () => {
      // Update cache key to match actual implementation
      const cacheKey = `meterdata:${params.tenantId}:${params.installationId}:${params.start}:${params.stop}:${params.interval}`;

      const mockData = [
        {
          timestamp: new Date('2024-01-01'),
          solar_value: 50,
          consumption_value: 30,
          self_consumption: 30,
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);

      // Mock the raw SQL query method
      mockRepository.query.mockResolvedValue(mockData);

      const result = await service.getMeasurements(params);

      expect(result).toEqual(mockData);

      expect(mockRepository.query).toHaveBeenCalledWith(expect.any(String), [
        params.solarMeterId,
        params.solarObisCode,
        params.consumptionMeterId,
        params.consumptionObisCode,
        params.tenantId,
        params.installationId,
        params.start,
        params.stop,
        params.limit,
      ]);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        cacheKey,
        mockData,
        3600000, // (3600000ms = 1 hour)
      );
    });

    it('should return cached measurements if available', async () => {
      // Update cache key to match actual implementation
      const cacheKey = `meterdata:${params.tenantId}:${params.installationId}:${params.start}:${params.stop}:${params.interval}`;

      const cachedData = [
        {
          timestamp: new Date('2024-01-01'),
          solar_value: 100,
          consumption_value: 60,
          self_consumption: 60,
        },
      ];

      mockCacheManager.get.mockResolvedValue(cachedData);

      const result = await service.getMeasurements(params);

      expect(result).toEqual(cachedData);
      expect(mockCacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(mockRepository.query).not.toHaveBeenCalled();
    });
  });
});
