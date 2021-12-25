import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { CreateCustomerComponent } from './dialogs/create-customer/create-customer.component';
import { SharedModule } from '../shared/shared.module';
import { PaymentsComponent } from './components/payments/payments.component';
import { OrdersComponent } from './components/orders/orders.component';


@NgModule({
  declarations: [CustomerListComponent, CustomerDetailsComponent, CreateCustomerComponent, PaymentsComponent, OrdersComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule
  ]
})
export class CustomersModule { }
