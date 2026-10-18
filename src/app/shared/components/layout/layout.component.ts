import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    imports: [NavBarComponent]
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
