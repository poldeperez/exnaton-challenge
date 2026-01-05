import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(tenantId: string) {
    const payload = {
      tenantId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
