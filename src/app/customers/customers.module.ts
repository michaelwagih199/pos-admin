import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { CreateCustomerComponent } from './dialogs/create-customer/create-customer.component';
import { SharedModule } from '../shared/shared.module';
import { PaymentsComponent } from './components/payments/payments.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CustomerPaymentComponent } from './components/customer-payment/customer-payment.component';
import { CustomerStatementComponent } from '../reports/components/customer-statement/customer-statement.component';


@NgModule({
  declarations: [CustomerListComponent,CustomerStatementComponent, CustomerDetailsComponent, CreateCustomerComponent, PaymentsComponent, OrdersComponent, CustomerPaymentComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule
  ]
})
export class CustomersModule { }
