import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './components/stock/stock.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { ProductsComponent } from './components/products/products.component';
import { SharedModule } from '../shared/shared.module';
import { CreateCategoryComponent } from './dialog/create-category/create-category.component';
import { CreateProductComponent } from './dialog/create-product/create-product.component';
import { BarcodeComponent } from './dialog/barcode/barcode.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { TailerTasksComponent } from './components/tailer-tasks/tailer-tasks.component';
import { AddTailerTasksComponent } from './dialog/add-tailer-tasks/add-tailer-tasks.component';

@NgModule({
  declarations: [StockComponent, ProductCategoryComponent, ProductsComponent, CreateCategoryComponent, CreateProductComponent, BarcodeComponent, TailerTasksComponent, AddTailerTasksComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    SharedModule,
    NgxBarcodeModule,
  ]
})
export class StockModule { }
