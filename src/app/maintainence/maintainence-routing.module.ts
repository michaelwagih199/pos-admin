import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '../core/services/auth-gaurd.service';
import { LayoutComponent } from '../shared/components';
import { MaintanenceComponent } from './maintanence/maintanence.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: MaintanenceComponent, canActivate: [AuthGaurdService]
      },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintainenceRoutingModule { }
