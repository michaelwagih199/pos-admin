import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/excel.service';
import { SaleOrderDetails } from 'src/app/sale-orders/models/orderDetails';
import { OrderPaymentModel } from 'src/app/sale-orders/models/orderPayment';
import { OrderDetailsService } from 'src/app/sale-orders/service/order-details.service';
import { OrderService } from 'src/app/sale-orders/service/order.service';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { Arabic } from 'src/app/text';
import { SalesRoportService } from '../../service/sales-roport.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  startDate: any;
  endDate: any;
  arabic: Arabic = new Arabic();

  
  orderCounter: number = 0;
  sumTotal: number = 0;

  ordersList: OrderPaymentModel[] = [];
  ordersDetailsList!: SaleOrderDetails[];

  constructor(
    private saleReport: SalesRoportService,
    private modalService: NgbModal,
    private orderDetailsService: OrderDetailsService,
    private saleOrderService: OrderService,
    private excelService:ExcelService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  getReport() {
    this.saleReport
      .getSales(this.formatDate(this.startDate), this.formatDate(this.endDate))
      .subscribe((data) => {
        this.ordersList = data;
        this.orderCounter = this.ordersList.length
        this.sumTotal= this.ordersList.map(a => a.totalOrder).reduce(function(a, b)
        {
          return a + b;
        });
       
      });
      
  }


  deleteDialog(obj: OrderPaymentModel) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.saleOrder.orderCode}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`,
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.saleOrderService.delete(obj.saleOrder.id).subscribe(
          (data) => {
            this.openSnackBar(
              `${this.arabic.stock.category.util.dialog.notification.deleted}`,
              ''
            );
            this.getReport();
          },
          (error) => console.log(error)
        );
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  details(content: any, item: OrderPaymentModel) {
    this.modalService.open(content);
    this.orderDetailsService
      .getByCode(item.saleOrder.orderCode)
      .subscribe((data) => {
        this.ordersDetailsList = data;
      });
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.ordersList, 'footballer_data');
  }
  

   /**
   * ui ux
   */
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 2000,
      });
    }
  
}
