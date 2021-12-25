import { ParcodeComponent } from './parcode/parcode.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReciptReportComponent } from './recipt-report/recipt-report.component';

const routes: Routes = [
  {
    path: '',
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
