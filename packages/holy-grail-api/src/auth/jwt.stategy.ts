import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import getJWTSecret from './get-jwt-secret';
import { IShittyUser } from './shitty-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJWTSecret(),
    });
  }

  validate(payload: any): IShittyUser {
    return { username: payload.sub };
  }
}
