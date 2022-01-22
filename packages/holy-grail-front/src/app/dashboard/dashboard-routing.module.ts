import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DomainComponent } from './domain/domain.component';
import { LayoutComponent } from './layout/layout.component';
import { ConfigComponent } from './settings/config/config.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: "/dashboard",
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'domain/:domain',
    component: DomainComponent
  },
  {
    path: 'settings',
    children: [
      {
        path: 'config',
        component: ConfigComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: LayoutComponent,
    children: routes
  }])],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
