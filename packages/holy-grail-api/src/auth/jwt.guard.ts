import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private authService: AuthService) {
        super();
    }

    // Written by fucking github copilot, don't trust it!
    async canActivate(context: any) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException();
        }
        const token = authHeader.split(' ')[1];
        const user = await this.authService.validateJWT(token);
        if (!user) {
            throw new UnauthorizedException();
        }
        const result = super.canActivate(context);
        if (result instanceof Observable) {
            return firstValueFrom(result);
        }
        return result;
    }
}
