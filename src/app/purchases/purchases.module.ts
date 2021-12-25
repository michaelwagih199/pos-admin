import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PurchasesBillsDetailsComponent } from './dialog/purchases-bills-details/purchases-bills-details.component';
import { PurchasesBillsComponent } from './components/purchases-bills/purchases-bills.component';
import { CreatePurchasesComponent } from './dialog/create-purchases/create-purchases.component';


@NgModule({
  declarations: [PurchasesBillsComponent, PurchasesBillsDetailsComponent, CreatePurchasesComponent],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    SharedModule
  ]
})
export class PurchasesModule { }
