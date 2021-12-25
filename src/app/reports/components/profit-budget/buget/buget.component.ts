import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/stock/model/productModel';
import { ProductServiceService } from 'src/app/stock/service/product-service.service';

@Component({
  selector: 'app-buget',
  templateUrl: './buget.component.html',
  styleUrls: ['./buget.component.scss'],
})
export class BugetComponent implements OnInit {
  isLoading: boolean = false;
  productList!: ProductModel[];
  total: number = 0;

  constructor(private productService: ProductServiceService) {}

  ngOnInit(): void {
    this.retrieveProducts();
  }

  retrieveProducts() {
    this.isLoading = true;
    this.productService.findAll().subscribe(
      (data) => {
        this.isLoading = false;
        this.productList = data;
        this.sumTotal();
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  sumTotal() {
    this.productList.forEach((element) => {
      this.total += element.numberUnitsInStock * element.purchasingPrice;
    });
  }
}
