import { Component, OnInit } from '@angular/core';
import { Arabic } from 'src/app/text';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ProductCategoryComponent } from '../product-category/product-category.component';
import { ProductsComponent } from '../products/products.component';


@Component({
    selector: 'app-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.scss'],
    imports: [MatTabGroup, MatTab, ProductCategoryComponent, ProductsComponent]
})
export class StockComponent implements OnInit {

  arabic:Arabic = new Arabic()

  constructor() { }

  ngOnInit(): void {
  }

}
