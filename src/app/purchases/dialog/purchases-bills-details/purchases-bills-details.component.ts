import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchasesBillsDetails } from '../../model/purchases-deteails';
import { PurchasingBillsDetailsService } from '../../service/purchasing-bills-details.service';

@Component({
  selector: 'app-purchases-bills-details',
  templateUrl: './purchases-bills-details.component.html',
  styleUrls: ['./purchases-bills-details.component.scss'],
})
export class PurchasesBillsDetailsComponent implements OnInit {
  listDetails!: PurchasesBillsDetails[];
  id: any;

  displayedColumns: string[] = [
    'id',
    'product',
    'itemQuantity',
    'itemPrice',
    'total',
  ];

  constructor(
    private dialogRef: MatDialogRef<PurchasesBillsDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private service: PurchasingBillsDetailsService
  ) {
    this.id = data.id;
    console.log(data.id);
  }

  ngOnInit(): void {
    this.service.getAllByBillId(this.id).subscribe(
      (data) => {
        this.listDetails = data;
      },
      (error) => console.log(error)
    );
  }

  close() {
    this.dialogRef.close();
  }

}
