import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InvalidTokenError } from './errors/invalid-token';
import IUser from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  private user?: IUser | null;

  getUser(): IUser | null {
    return this.user ?? null;
  }

  async isLoggedIn() {
    const token = localStorage.getItem('JWT_TOKEN');
    if (!token) {
      return false;
    }

    const user = await this.loadUser(token);

    return !!user;
  }

  async login(token: string) {
    localStorage.setItem('JWT_TOKEN', token);
    if (!(await this.isLoggedIn())) {
      throw new InvalidTokenError();
    }
  }

  logout() {
    localStorage.removeItem('JWT_TOKEN');
    this.router.navigate(['/login']);
  }

  private async loadUser(token: string): Promise<IUser | null> {
    const user = await this.httpClient.get<IUser>('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .toPromise()
    .catch(err => {
      if (err.status && err.status === 401) {
        return;
      }

      throw err;
    });

    this.user = user ?? null;
    return this.user;
  }
}