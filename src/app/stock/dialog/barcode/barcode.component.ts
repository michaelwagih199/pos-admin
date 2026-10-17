import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { ProductModel } from '../../model/productModel';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgxBarcodeModule } from '../../../shared/barcode/ngx-barcode.module';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-barcode',
    templateUrl: './barcode.component.html',
    styleUrls: ['./barcode.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgxBarcodeModule, MatDialogActions, MatButton]
})
export class BarcodeComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<BarcodeComponent>>(MatDialogRef);
  private router = inject(Router);
  private dataServer = inject(DataService);

  model: ProductModel = new ProductModel();
  dialogData = inject(MAT_DIALOG_DATA);

  constructor() {
    this.model = this.dialogData.productCode;
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
