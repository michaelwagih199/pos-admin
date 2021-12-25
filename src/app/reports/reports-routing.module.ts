import { ProfitsListComponent } from './components/profit-budget/profits-list/profits-list.component';
import { ProfitsComponent } from './components/profit-budget/profits/profits.component';
import { SalesReportComponent } from './components/sales-report/sales-report.component';
import { CompoundReportComponent } from './components/compound-report/compound-report.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '../core/services/auth-gaurd.service';
import { LayoutComponent } from '../shared/components';
import { ReportListComponent } from './components/report-list/report-list.component';
import { TreasuryComponent } from './components/safe/treasury/treasury.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ReportListComponent, canActivate: [AuthGaurdService]
      },

      {
        path: 'treasury',
        component: TreasuryComponent, canActivate: [AuthGaurdService]
      },
      {
        path: 'compound',
        component: CompoundReportComponent, canActivate: [AuthGaurdService]
      },
      {
        path: 'sales',
        component: SalesReportComponent, canActivate: [AuthGaurdService]
      },
      {
        path: 'profit',
        component: ProfitsListComponent, canActivate: [AuthGaurdService]
      },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
