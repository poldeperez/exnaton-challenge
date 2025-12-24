import { Test, TestingModule } from '@nestjs/testing';
import { MeterController } from './meterdata.controller';
import { MeterService } from './meterdata.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TenantGuard } from '../common/guards/tenant.guard';
import { MeterReading } from './meterdata.entity';

describe('MeterController', () => {
  let controller: MeterController;
  let meterService: MeterService;

  const mockMeterService = {
    ingestFromUrl: jest.fn(),
    getInstallationsByTenant: jest.fn(),
    getMeasurements: jest.fn(),
  };

  const mockMeterReadingRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeterController],
      providers: [
        {
          provide: MeterService,
          useValue: mockMeterService,
        },
        {
          provide: getRepositoryToken(MeterReading),
          useValue: mockMeterReadingRepository,
        },
        TenantGuard,
      ],
    }).compile();

    controller = module.get<MeterController>(MeterController);
    meterService = module.get<MeterService>(MeterService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
