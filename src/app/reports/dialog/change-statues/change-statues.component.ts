import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/sale-orders/service/order.service';

interface Data {
  orderId: number
}

@Component({
  templateUrl: './change-statues.component.html',
  styleUrls: ['./change-statues.component.scss']
})
export class ChangeStatuesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private orderService: OrderService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ChangeStatuesComponent>) {

  }

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data);
    }
  }


  onChangeStatus(statues: any) {
    this.orderService.changeStatues(this.data.orderId, statues).subscribe(() => {
      this.dialogRef.close();
      this.openSnackBar('Statues Changed', '')
    }, error => console.log(error))
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
