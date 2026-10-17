import { Component, OnInit, inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Arabic } from 'src/app/text';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Supplier } from '../../models/supplier';
import { MatDivider } from '@angular/material/divider';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-create-suppliers',
    templateUrl: './create-suppliers.component.html',
    styleUrls: ['./create-suppliers.component.scss'],
    imports: [MatDialogTitle, MatDivider, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton]
})
export class CreateSuppliersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<CreateSuppliersComponent>>(MatDialogRef);


  arabic: Arabic = new Arabic()
  supplier: Supplier = new Supplier()
  validateForm!: FormGroup;

  dialogData = inject(MAT_DIALOG_DATA);

  constructor() {
    this.supplier = this.dialogData.model
  }

  ngOnInit(): void {
    this.validateform()
  }

  save() {
    let data = {
      model: this.supplier,
    }
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close()
  }

  validateform() {
    this.validateForm = this.fb.group({
      supplierName: [null, [Validators.required]],
      supplierPhone: [null, [Validators.required]],
      supplierCompany: [null,],
      supplierAddress: [null,],
      notes: [null,],
    });
  }

}
