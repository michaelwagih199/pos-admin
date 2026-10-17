import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { PurchasesBillsDetailsComponent } from 'src/app/purchases/dialog/purchases-bills-details/purchases-bills-details.component';
import { PurchasesBillsDetails } from 'src/app/purchases/model/purchases-deteails';
import { PurchasingBillsDetailsService } from 'src/app/purchases/service/purchasing-bills-details.service';
import { RetrivalsDetailsModel } from 'src/app/retrivals/models/retrivals-details-model';
import { RetrivalsDetailsService } from 'src/app/retrivals/service/retrivals-details.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-rerival-details',
    templateUrl: './rerival-details.component.html',
    styleUrls: ['./rerival-details.component.scss'],
    imports: [CdkScrollable, MatDialogContent, MatProgressBar, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatDivider, MatDialogActions, MatButton, DecimalPipe]
})
export class RerivalDetailsComponent implements OnInit {

  listDetails: RetrivalsDetailsModel[] = [];
  id: any;
  isLoading = false;

  displayedColumns: string[] = [
    'id',
    'product',
    'sourceInvoice',     // ← new
    'rolls',
    'units',
    'price',
    'total',
    'condition',
    'reason',
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
    this.isLoading = true;
    this.service.getAllByBillId(this.id).subscribe({
      next: (data) => {
        this.listDetails = data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load retrieval details', error);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
