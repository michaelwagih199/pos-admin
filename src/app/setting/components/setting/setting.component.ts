import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss'],
    imports: [RouterLink]
})
export class SettingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
