import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-about-app-dialog',
    templateUrl: './about-app-dialog.component.html',
    styleUrls: ['./about-app-dialog.component.scss'],
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent]
})
export class AboutAppDialogComponent implements OnInit {
  dialog = inject(MatDialog);

  
  ngOnInit(): void {
  }

}
