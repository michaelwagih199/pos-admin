import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchasesBillsDetailsComponent } from 'src/app/purchases/dialog/purchases-bills-details/purchases-bills-details.component';
import { PurchasesBillsDetails } from 'src/app/purchases/model/purchases-deteails';
import { PurchasingBillsDetailsService } from 'src/app/purchases/service/purchasing-bills-details.service';
import { RetrivalsDetailsModel } from 'src/app/retrivals/models/retrivals-details-model';
import { RetrivalsDetailsService } from 'src/app/retrivals/service/retrivals-details.service';

@Component({
  selector: 'app-rerival-details',
  templateUrl: './rerival-details.component.html',
  styleUrls: ['./rerival-details.component.scss']
})
export class RerivalDetailsComponent implements OnInit {

  listDetails!: RetrivalsDetailsModel[];
  id: any;

  displayedColumns: string[] = [
    'id',
    'product',
    'quantity',
    'price',
    'total',
  ];

  constructor(
    private dialogRef: MatDialogRef<RerivalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private service: RetrivalsDetailsService
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
