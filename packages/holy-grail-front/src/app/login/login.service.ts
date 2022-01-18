import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import BadCredentialsError from './errors/bad-credentials-error';

interface ILoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  async login(username: string, password: string) {
    try {
      const accessToken = await this.httpClient.post<ILoginResponse>('/api/auth/login', {
        username: username,
        password: password
      }).toPromise();

      await this.authService.login(accessToken.access_token);
    }
    catch (err) {
      console.error(err);
      const error: any = err;

      if (error.status && error.status === 401) {
        throw new BadCredentialsError();
      }

      throw err;
    }
  }
}
