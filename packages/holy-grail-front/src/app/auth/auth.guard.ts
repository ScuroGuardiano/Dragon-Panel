import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ErrorPageService } from '../error-page/error-page.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private errorPageService: ErrorPageService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    try {
      if (await this.authService.isLoggedIn()) {
        return true;
      }
      return this.router.parseUrl('/login');
    }
    catch(err) {
      console.error(err);
      this.errorPageService.setError(err);
      return this.router.parseUrl('/error');
    }
  }

}
