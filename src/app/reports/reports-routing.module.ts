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
import { CollectorReportComponent } from './components/collector-report/collector-report.component';
import { SafeDailyReportComponent } from './components/safe/safe-daily-report/safe-daily-report.component';
import { SupplierStatementComponent } from './components/supplier-statement/supplier-statement.component';

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
       {
        path: 'collector',
        component: CollectorReportComponent,
        canActivate: [AuthGaurdService],
      },

            { path: 'daily-safe', component: SafeDailyReportComponent, canActivate: [AuthGaurdService] },  // 👈 new
            { path: 'supplier-statement', component: SupplierStatementComponent, canActivate: [AuthGaurdService] },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
