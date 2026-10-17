import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Arabic } from 'src/app/text';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-create-category',
    templateUrl: './create-category.component.html',
    styleUrls: ['./create-category.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatFormField, MatInput, MatDialogActions, MatButton]
})
export class CreateCategoryComponent implements OnInit {
    private fb = inject(FormBuilder);
    private dialogRef = inject<MatDialogRef<CreateCategoryComponent>>(MatDialogRef);

    arabic: Arabic = new Arabic()
    description: string;

    dialogData = inject(MAT_DIALOG_DATA);

    constructor() {
        this.description = this.dialogData.description;
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            description: [this.description, [Validators.required]],
        });
    }

    save() {
        this.dialogRef.close(this.validateForm.value);
    }

    validateForm!: FormGroup;
    submitForm(): void {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
        
    close() {
        this.dialogRef.close();
    }

}
