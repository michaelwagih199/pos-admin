import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CreateCustomerComponent } from 'src/app/customers/dialogs/create-customer/create-customer.component';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { Arabic } from 'src/app/text';
import { UserModel } from '../../models/user';
import { MatDivider } from '@angular/material/divider';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput, MatSuffix } from '@angular/material/input';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-add-user-dialog',
    templateUrl: './add-user-dialog.component.html',
    styleUrls: ['./add-user-dialog.component.scss'],
    imports: [MatDialogTitle, MatDivider, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatIconButton, MatSuffix, MatIcon, MatDialogActions, MatButton]
})
export class AddUserDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<CreateCustomerComponent>>(MatDialogRef);

 
  arabic: Arabic = new Arabic()
  user: UserModel = new UserModel();
  validateForm!: FormGroup;
  selectedRoles!:any
  hide = true;

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
