import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '../core/services/auth-gaurd.service';
import { LayoutComponent } from '../shared/components';
import { RetrivalsComponent } from './components/retrivals/retrivals.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: RetrivalsComponent,canActivate:[AuthGaurdService]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetrivalsRoutingModule { }
