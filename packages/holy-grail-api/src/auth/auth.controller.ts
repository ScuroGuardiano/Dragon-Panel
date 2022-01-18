import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { ShittyAuthGuard } from './shitty-auth.guard';
import { IShittyUser } from './shitty-user';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(ShittyAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Request() req): Promise<IShittyUser> {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(@Request() req) {
        await this.authService.logout(req.headers.authorization.split(' ')[1]);
    }
}
