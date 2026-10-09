import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/components';
import { AuthGaurdService } from '../core/services/auth-gaurd.service';
import { SupliersListComponent } from './components/supliers-list/supliers-list.component';
import { SupplierDetailsComponent } from './components/supplier-details/supplier-details.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: SupliersListComponent,canActivate:[AuthGaurdService]
      },
      {
        path: 'supplierDetails/:id',
        component: SupplierDetailsComponent,canActivate:[AuthGaurdService]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
