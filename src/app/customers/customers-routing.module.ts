import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/components';
import { AuthGaurdService } from '../core/services/auth-gaurd.service';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { CustomerPaymentComponent } from './components/customer-payment/customer-payment.component';
import { CustomerStatementComponent } from '../reports/components/customer-statement/customer-statement.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: CustomerListComponent, canActivate: [AuthGaurdService]
      },
      {
        path: 'customerDetails/:id',
        component: CustomerDetailsComponent, canActivate: [AuthGaurdService]
      },
      { path: 'payment', component: CustomerPaymentComponent, canActivate: [AuthGaurdService] },
      {
        path: 'statement',
        component: CustomerStatementComponent,
        canActivate: [AuthGaurdService],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
