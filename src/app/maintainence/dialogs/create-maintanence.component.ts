import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateProductComponent } from 'src/app/stock/dialog/create-product/create-product.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Arabic } from 'src/app/text';
import { MaintanenceModel } from '../models/maintanceObject';

@Component({
  templateUrl: './create-maintanence.component.html',
  styleUrls: ['./create-maintanence.component.scss']
})
export class CreateMaintanenceComponent implements OnInit {

  maintanence: MaintanenceModel = new MaintanenceModel();
  validateForm!: FormGroup;
  arabic: Arabic = new Arabic()

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.maintanence = data.model
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
