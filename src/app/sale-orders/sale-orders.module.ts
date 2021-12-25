import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleOrdersRoutingModule } from './sale-orders-routing.module';
import { SaleOrderComponent } from './components/sale-order/sale-order.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [SaleOrderComponent],
  imports: [
    CommonModule,
    SaleOrdersRoutingModule,
    SharedModule
  ]
})
export class SaleOrdersModule { }
