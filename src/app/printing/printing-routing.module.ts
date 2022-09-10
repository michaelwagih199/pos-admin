import { ParcodeComponent } from './parcode/parcode.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReciptReportComponent } from './recipt-report/recipt-report.component';
import { AuthGaurdService } from '../core/services/auth-gaurd.service';

const routes: Routes = [
  {
    path: 'sale-order-invoice',
    component: ReciptReportComponent
  },
  {
    path: 'parcode',
    component: ParcodeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintingRoutingModule { }
