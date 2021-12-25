import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintingRoutingModule } from './printing-routing.module';
import { ReciptReportComponent } from './recipt-report/recipt-report.component';
import { ParcodeComponent } from './parcode/parcode.component';
import { NgxBarcodeModule } from 'ngx-barcode';


@NgModule({
  declarations: [ReciptReportComponent, ParcodeComponent],
  imports: [
    CommonModule,
    PrintingRoutingModule,
    SharedModule, 
    NgxBarcodeModule,
  ]
})
export class PrintingModule { }
