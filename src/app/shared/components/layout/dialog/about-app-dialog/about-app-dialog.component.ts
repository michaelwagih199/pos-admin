import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-about-app-dialog',
  templateUrl: './about-app-dialog.component.html',
  styleUrls: ['./about-app-dialog.component.scss']
})
export class AboutAppDialogComponent implements OnInit {

  constructor(public dialog: MatDialog) {}
  
  ngOnInit(): void {
  }

}
