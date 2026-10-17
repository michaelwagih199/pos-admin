import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleOrdersRoutingModule } from './sale-orders-routing.module';
import { SaleOrderComponent } from './components/sale-order/sale-order.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        SaleOrdersRoutingModule,
        SharedModule,
        SaleOrderComponent
    ]
})
export class SaleOrdersModule { }
