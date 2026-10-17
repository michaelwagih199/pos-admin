import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { ProductModel } from '../../model/productModel';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'],
})
export class BarcodeComponent implements OnInit {
  model: ProductModel = new ProductModel();
  constructor(
    private dialogRef: MatDialogRef<BarcodeComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private router: Router,
    private dataServer: DataService
  ) {
    this.model = data.productCode;
  }

  ngOnInit(): void {}

  onPrint() {
    let data = {
      parcode: this.model.productCode,
      name: this.model.productName,
      price: this.model.retailPrice,
    };
    this.dataServer.changeMessage(data);
    this.redirectTo(`/printing/parcode`);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
