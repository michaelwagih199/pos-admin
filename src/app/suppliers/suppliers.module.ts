import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SupliersListComponent } from './components/supliers-list/supliers-list.component';
import { SupliersPaymentComponent } from './components/supliers-payment/supliers-payment.component';
import { SharedModule } from '../shared/shared.module';
import { CreateSuppliersComponent } from './dialogs/create-suppliers/create-suppliers.component';


@NgModule({
  declarations: [SupliersListComponent, SupliersPaymentComponent, CreateSuppliersComponent],
  imports: [
    CommonModule,
    SuppliersRoutingModule,
    SharedModule
  ]
})
export class SuppliersModule { }
