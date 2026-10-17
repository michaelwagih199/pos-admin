import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateCustomerComponent } from 'src/app/customers/dialogs/create-customer/create-customer.component';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { Arabic } from 'src/app/text';
import { UserModel } from '../../models/user';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {
 
  arabic: Arabic = new Arabic()
  user: UserModel = new UserModel();
  validateForm!: FormGroup;
  selectedRoles!:any
  hide = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCustomerComponent>) {
  }

  ngOnInit(): void {
    this.validateform()
  }
  
  save() {
    let data = {
      userModel: this.user,
      selectedRoles:this.selectedRoles
    }
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }

  validateform() {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      password: ['',[Validators.minLength(8)]],
    });
  }

}
