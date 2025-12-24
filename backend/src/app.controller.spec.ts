import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      if (key === 'NODE_ENV') {
        return 'test';
      }
      return defaultValue;
    }) as (key: string, defaultValue?: string) => string,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);

    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should return Health check', () => {
      const result: {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
      } = appController.getHealthCheck();
      expect(result).toHaveProperty('status', 'ok');
    });
  });
});
