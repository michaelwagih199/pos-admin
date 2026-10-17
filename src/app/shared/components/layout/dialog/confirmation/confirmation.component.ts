import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})

export class ConfirmationDialog implements OnInit {
  private data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<ConfirmationDialog>>(MatDialogRef);


  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"

  constructor() {
    const data = this.data;

    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  ngOnInit(): void {
    
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
