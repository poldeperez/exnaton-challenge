import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('tenant-login')
  loginByTenant(@Body('tenantId') tenantId: string) {
    const allowedTenants = ['tenant-a', 'tenant-b'];

    if (!allowedTenants.includes(tenantId)) {
      throw new UnauthorizedException('Invalid tenant');
    }

    return this.authService.generateToken(tenantId);
  }
}
