import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { DomainComponent } from './domain/domain.component';
import { ConfigComponent } from './settings/config/config.component';
import { FormsModule } from '@angular/forms';
import { AddRecordComponent } from './domain/add-record/add-record.component';
import { ProxyComponent } from './proxy/proxy.component';
import { AddEntryComponent } from './proxy/add-entry/add-entry.component';
import { EditEntryComponent } from './proxy/edit-entry/edit-entry.component';



@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    NavigationComponent,
    DomainComponent,
    ConfigComponent,
    AddRecordComponent,
    ProxyComponent,
    AddEntryComponent,
    EditEntryComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxUIModule,
    FormsModule
  ]
})
export class DashboardModule { }
