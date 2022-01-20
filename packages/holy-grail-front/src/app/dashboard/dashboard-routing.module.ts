import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LayoutComponent } from './layout/layout.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
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
