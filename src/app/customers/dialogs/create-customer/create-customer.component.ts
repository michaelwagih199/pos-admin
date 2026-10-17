import { Component, OnInit, inject } from '@angular/core';
import { Arabic } from 'src/app/text';
import { CustomerModel } from '../../model/customer-model';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDivider } from '@angular/material/divider';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-create-customer',
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
    imports: [MatDialogTitle, MatDivider, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton]
})
export class CreateCustomerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<CreateCustomerComponent>>(MatDialogRef);


  arabic: Arabic = new Arabic()
  customer: CustomerModel = new CustomerModel()
  validateForm!: FormGroup;

  dialogData = inject(MAT_DIALOG_DATA);

  constructor() {
    this.customer = this.dialogData.model
  }

  ngOnInit(): void {
    this.validateform()
  }


  save() {
    let data = {
      customerModel: this.customer,
    }
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }

  validateform() {
    this.validateForm = this.fb.group({
      customerName: [null, [Validators.required]],
      customerPhone: [null, [Validators.required]],
      notes: [null,],
    });
  }
}
