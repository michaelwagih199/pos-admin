import { Component, OnInit, Inject } from '@angular/core';
import { Arabic } from 'src/app/text';
import { CustomerModel } from '../../model/customer-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  arabic: Arabic = new Arabic()
  customer: CustomerModel = new CustomerModel()
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.customer = data.model
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
