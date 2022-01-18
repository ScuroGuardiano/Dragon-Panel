import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IShittyUser } from './shitty-user';

@Injectable()
export class ShittyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<IShittyUser> {
    const user = this.authService.shittyValidate(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
