import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { DomainComponent } from './domain/domain.component';
import { ConfigComponent } from './settings/config/config.component';



@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    NavigationComponent,
    DomainComponent,
    ConfigComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxUIModule
  ]
})
export class DashboardModule { }
