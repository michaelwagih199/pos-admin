import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Arabic } from 'src/app/text';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Supplier } from '../../models/supplier';

@Component({
  selector: 'app-create-suppliers',
  templateUrl: './create-suppliers.component.html',
  styleUrls: ['./create-suppliers.component.scss']
})
export class CreateSuppliersComponent implements OnInit { 
  
  arabic: Arabic = new Arabic()
  supplier: Supplier = new Supplier()
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateSuppliersComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.supplier = data.model
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
    this.dialogRef.close();
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
