import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.authService.isTokenSet()) {
      return next.handle(request);
    }

    const authReq = request.clone({ setHeaders: {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }});

    return next.handle(authReq);
  }
}

