import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RevokedJwt } from './models/revoked-jwt.entity';
import { IShittyUser } from './shitty-user';

@Injectable()
export class AuthService {
    private password: string;
    constructor(
        private jwtService: JwtService
    ) {
        if(!process.env.PASSWORD) {
            throw new Error("No PASSWORD enviroment variable set. Thou shall set it and then run this shit.");
        }

        this.password = process.env.PASSWORD;
    }

    shittyValidate(username: string, password: string): IShittyUser {
        return (username === 'admin' && password === this.password) ? { username: 'admin' } : null;
    }

    login(user: IShittyUser) {
        return {
            access_token: this.jwtService.sign({ sub: user.username })
        }
    }

    async logout(jwt: string) {
        await RevokedJwt.revokeJWT(jwt);
    }

    async validateJWT(jwt: string): Promise<IShittyUser> {
        if(await RevokedJwt.isRevoked(jwt)) {
            return null;
        }

        try {
            const user = this.jwtService.decode(jwt) as IShittyUser;
            return user;
        } catch(e) {
            return null;
        }
    }
}
