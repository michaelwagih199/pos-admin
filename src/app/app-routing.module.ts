import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
  },
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule),
  },
  {
    path: 'saleOrder',
    loadChildren: () => import('./sale-orders/sale-orders.module').then(m => m.SaleOrdersModule),
  },
  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule),
  },
  {
    path: 'suppliers',
    loadChildren: () => import('./suppliers/suppliers.module').then(m => m.SuppliersModule),
  },
  {
    path: 'purchases',
    loadChildren: () => import('./purchases/purchases.module').then(m => m.PurchasesModule),
  },
  {
    path: 'retrivals',
    loadChildren: () => import('./retrivals/retrivals.module').then(m => m.RetrivalsModule),
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
  },
  {
    path: 'printing',
    loadChildren: () => import('./printing/printing.module').then(m => m.PrintingModule),
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./maintainence/maintainence.module').then(m => m.MaintainenceModule),
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
  },
   {path: '**',redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
