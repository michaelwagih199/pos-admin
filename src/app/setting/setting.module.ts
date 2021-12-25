import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SettingComponent } from './components/setting/setting.component';
import { UsersComponent } from './components/users/users.component';
import { UserListComponent } from './components/userComponnents/user-list/user-list.component';
import { UserLogComponent } from './components/userComponnents/user-log/user-log.component';
import { RolesAndpermissionComponent } from './components/userComponnents/roles-andpermission/roles-andpermission.component';


@NgModule({
  declarations: [SettingComponent, UsersComponent, UserListComponent, UserLogComponent, RolesAndpermissionComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }
