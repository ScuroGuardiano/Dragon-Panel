import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import getJWTSecret from './get-jwt-secret';
import { JwtStrategy } from './jwt.stategy';
import { ShittyStrategy } from './shitty.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ShittyStrategy, JwtStrategy],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: getJWTSecret(),
      signOptions: { expiresIn: "1h" }
    })
  ]
})
export class AuthModule {}
