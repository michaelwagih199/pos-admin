import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/components';
import { AuthGaurdService } from '../core/services/auth-gaurd.service';
import { SupliersListComponent } from './components/supliers-list/supliers-list.component';
import { SupliersPaymentComponent } from './components/supliers-payment/supliers-payment.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: SupliersListComponent,canActivate:[AuthGaurdService]
      },
      {
        path: 'supplierDetails/:id',
        component:SupliersPaymentComponent,canActivate:[AuthGaurdService]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
