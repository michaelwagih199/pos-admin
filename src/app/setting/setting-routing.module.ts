import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '../core/services/auth-gaurd.service';
import { LayoutComponent } from '../shared/components';
import { SettingComponent } from './components/setting/setting.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: SettingComponent,canActivate:[AuthGaurdService]
      },
      {
        path: 'users',
        component: UsersComponent,canActivate:[AuthGaurdService]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
