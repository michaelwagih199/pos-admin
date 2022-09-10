import {
  AfterViewChecked,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  SecurityContext,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as printJS from "print-js";

import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/service/data.service';

import { SaleOrderInvoceService } from '../service/sale-order-invoce.service';

export interface data {
  orderCode: any;
}

@Component({
  selector: 'app-recipt-report',
  templateUrl: './recipt-report.component.html',
  styleUrls: ['./recipt-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReciptReportComponent
  implements OnInit,AfterViewChecked {
    sharedData!: data;
    subscription!: Subscription;
  private routeSub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataServer: DataService,
    private salOrderPayment: SaleOrderInvoceService,
    private _snackBar: MatSnackBar
  ) {  }


  ngOnInit(): void {

    this.subscription = this.dataServer.currentMessage.subscribe((message) => {
      this.sharedData = message;
    });
    
    if (this.sharedData.orderCode) {
      this.salOrderPayment.printSaleOrderInvoice(this.sharedData.orderCode).subscribe(
        response => {
          let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          const blobUrl = URL.createObjectURL(blob);
          printJS(blobUrl);
          this.toSaleOrder('saleOrder');
        },
        error => {
          console.log(error);
          this.openSnackBar(error.message, "error");
        }
      );
    }
  }


  ngAfterViewChecked(): void {
   
  }




  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  @HostListener('window:afterprint')
  toSaleOrder(val: any) {
    this.redirectTo(`/${val}`);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
