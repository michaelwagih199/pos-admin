import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Arabic } from 'src/app/text';

@Component({
    selector: 'app-create-category',
    templateUrl: './create-category.component.html',
    styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {
    arabic: Arabic = new Arabic()
    description: string;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CreateCategoryComponent>,
        @Inject(MAT_DIALOG_DATA) data: any) {
        this.description = data.description;
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
