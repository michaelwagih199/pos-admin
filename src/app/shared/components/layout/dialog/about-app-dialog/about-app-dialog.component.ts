import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-about-app-dialog',
    templateUrl: './about-app-dialog.component.html',
    styleUrls: ['./about-app-dialog.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton]
})
export class AboutAppDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AboutAppDialogComponent>);

  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
