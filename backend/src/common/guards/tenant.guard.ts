import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MeterReading } from '../../meterdata/meterdata.entity';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    @InjectRepository(MeterReading)
    private meterReadingRepository: Repository<MeterReading>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new BadRequestException('Missing X-Tenant-ID header');
    }

    // Validate tenant format
    if (typeof tenantId !== 'string' || tenantId.trim().length === 0) {
      throw new UnauthorizedException('Invalid X-Tenant-ID header');
    }

    // Check if tenant exists in database
    const tenantExists = await this.meterReadingRepository
      .createQueryBuilder('meter_reading')
      .select('1')
      .where('meter_reading.tenantId = :tenantId', { tenantId })
      .limit(1)
      .getRawOne();

    if (!tenantExists) {
      throw new UnauthorizedException('Tenant not found or unauthorized');
    }

    // Attach tenantId to request for easy access in controllers
    request.tenantId = tenantId;

    return true;
  }
}
