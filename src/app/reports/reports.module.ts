import { ProfitsListComponent } from './components/profit-budget/profits-list/profits-list.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './components/report-list/report-list.component';
import { TreasuryComponent } from './components/safe/treasury/treasury.component';
import { CompoundReportComponent } from './components/compound-report/compound-report.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SalesReportComponent } from './components/sales-report/sales-report.component';
import { DepositWithdrawelsComponent } from './components/safe/deposit-withdrawels/deposit-withdrawels.component';
import { SafeReportComponent } from './components/safe/safe-report/safe-report.component';
import { ProfitsComponent } from './components/profit-budget/profits/profits.component';
import { BugetComponent } from './components/profit-budget/buget/buget.component';

@NgModule({
  declarations: [
    ReportListComponent,
    TreasuryComponent,
    CompoundReportComponent,
    SalesReportComponent,
    DepositWithdrawelsComponent,
    SafeReportComponent,
    ProfitsComponent,
    ProfitsListComponent,
    BugetComponent
  ],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class ReportsModule {}
