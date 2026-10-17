import { Component, OnInit } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { UserListComponent } from '../userComponnents/user-list/user-list.component';
import { UserLogComponent } from '../userComponnents/user-log/user-log.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    imports: [MatTabGroup, MatTab, UserListComponent, UserLogComponent]
})
export class UsersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
