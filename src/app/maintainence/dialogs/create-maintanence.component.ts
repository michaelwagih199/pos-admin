import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateProductComponent } from 'src/app/stock/dialog/create-product/create-product.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Arabic } from 'src/app/text';
import { MaintanenceModel } from '../models/maintanceObject';
import { MatDivider } from '@angular/material/divider';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput, MatSuffix } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-create-maintanence',
    templateUrl: './create-maintanence.component.html',
    styleUrls: ['./create-maintanence.component.scss'],
    imports: [MatDialogTitle, MatDivider, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatDialogActions, MatButton]
})
export class CreateMaintanenceComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<CreateProductComponent>>(MatDialogRef);


  maintanence: MaintanenceModel = new MaintanenceModel();
  validateForm!: FormGroup;
  arabic: Arabic = new Arabic()

  dialogData = inject(MAT_DIALOG_DATA);

  constructor() {
    this.maintanence = this.dialogData.model
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      customerName: [null, [Validators.required]],
      maintanenceDate: [null, [Validators.required]],
      notes: [null, ],
    });
  }

  /**
   * events
   */

  save() {
    let data = {
      model: this.maintanence,
    }
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }

  public onDate(event:any): void {
    console.log(event);
    
  }


}
