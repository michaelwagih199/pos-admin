import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { PurchasesBillsDetails } from '../../model/purchases-deteails';
import { PurchasingBillsDetailsService } from '../../service/purchasing-bills-details.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-purchases-bills-details',
    templateUrl: './purchases-bills-details.component.html',
    styleUrls: ['./purchases-bills-details.component.scss'],
    imports: [CdkScrollable, MatDialogContent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatDivider, MatDialogActions, MatButton]
})
export class PurchasesBillsDetailsComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<PurchasesBillsDetailsComponent>>(MatDialogRef);
  private service = inject(PurchasingBillsDetailsService);

  listDetails!: PurchasesBillsDetails[];
  id: any;

  displayedColumns: string[] = [
    'product',
    'itemQuantity',
    'numberOfPieces',
  ];

  dialogData = inject(MAT_DIALOG_DATA);

  constructor() {
    this.id = this.dialogData.id;
    console.log(this.dialogData.id);
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
