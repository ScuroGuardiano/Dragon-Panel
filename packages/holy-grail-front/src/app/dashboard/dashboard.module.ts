import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { LayoutComponent } from './layout/layout.component';



@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxUIModule
  ]
})
export class DashboardModule { }
