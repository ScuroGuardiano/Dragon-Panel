import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InputTypes, TipStatus } from '@swimlane/ngx-ui';
import BadCredentialsError from './errors/bad-credentials-error';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  username = '';
  password = '';
  InputTypes = InputTypes;
  TipStatus = TipStatus;
  error = '';
  logginIn = false;

  ngOnInit(): void {
  }

  get canLogin() {
    return this.username.length > 0 && this.password.length > 0 && !this.logginIn;
  }

  async login() {
    this.error = '';
    this.logginIn = true;
    this.loginService.login(this.username, this.password)
      .then(() => this.router.navigate(['']))
      .catch(err => this.processLoginError(err))
      .finally(() => this.logginIn = false);
  }

  private processLoginError(err: any) {
    if (err instanceof BadCredentialsError) {
      this.error = err.message;
    }
    else {
      this.error = "Uknown error, check out console for full error details";
    }
  }
}
