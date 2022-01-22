import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { IconModule, InputModule, NgxUIModule, SectionModule, TipModule } from '@swimlane/ngx-ui';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '../auth/auth.module';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  providers: [
    LoginService
  ],
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    AuthModule,
    FormsModule,
    NgxUIModule
  ]
})
export class LoginModule { }
