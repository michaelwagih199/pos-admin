import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HotkeyBarComponent } from './hotkey-bar/hotkey-bar.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    imports: [NavBarComponent, HotkeyBarComponent]
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
