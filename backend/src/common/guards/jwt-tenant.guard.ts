import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { MeterReading } from '../../meterdata/meterdata.entity';

interface RequestWithUser extends Request {
  user?: {
    tenantId: string;
  };
  tenantId?: string;
}

@Injectable()
export class JwtTenantGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(MeterReading)
    private readonly meterReadingRepository: Repository<MeterReading>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First validates JWT (Passport)
    const isAuthenticated = (await super.canActivate(context)) as boolean;

    if (!isAuthenticated) {
      throw new UnauthorizedException('Invalid or missing JWT');
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // TenantId comes from JWT payload (req.user)
    const tenantId = request.user?.tenantId;

    if (!tenantId || typeof tenantId !== 'string') {
      throw new UnauthorizedException('Tenant not found in token');
    }

    // Verify tenant exists in DB
    const tenantExists = await this.meterReadingRepository
      .createQueryBuilder('meter_reading')
      .select('1')
      .where('meter_reading.tenantId = :tenantId', { tenantId })
      .limit(1)
      .getRawOne<unknown>();

    if (!tenantExists) {
      throw new UnauthorizedException('Tenant not found or unauthorized');
    }

    request.tenantId = tenantId;

    return true;
  }
}
