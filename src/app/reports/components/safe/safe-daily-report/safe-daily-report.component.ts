import { Component, OnInit } from '@angular/core';
import { Arabic } from 'src/app/text';
import { DailySafeReport, DailySafeReportService } from '../../../service/daily-safe-report.service';

@Component({
  selector: 'app-safe-daily-report',
  templateUrl: 'safe-daily-report.component.html',
  styleUrls: ['safe-daily-report.component.scss'],
})
export class SafeDailyReportComponent implements OnInit {
  arabic: Arabic = new Arabic();

  selectedDate: Date = new Date();
  report: DailySafeReport | null = null;
  notes = '';
  isLoading = false;
  loaded = false;

  constructor(private dailySafeReportService: DailySafeReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    const dateStr = this.formatDate(this.selectedDate);
    this.isLoading = true;

    this.dailySafeReportService.getDailyReport(dateStr).subscribe({
      next: (res) => {
        this.report = res;
        this.isLoading = false;
        this.loaded = true;
      },
      error: (err) => {
        console.error(err);
        this.report = null;
        this.isLoading = false;
        this.loaded = true;
      },
    });
  }

  goToday(): void {
    this.selectedDate = new Date();
    this.loadReport();
  }

  print(): void {
    window.print();
  }

  /** True when the day has at least one movement row in any section. */
  get hasMovements(): boolean {
    if (!this.report) return false;
    return (
      (this.report.customerPaymentsDetails?.length ?? 0) > 0 ||
      (this.report.cashSalesDetails?.length ?? 0) > 0 ||
      (this.report.purchasesDetails?.length ?? 0) > 0 ||
      (this.report.cashRetrievalsDetails?.length ?? 0) > 0
    );
  }

  /** Combined sales row count (single backend list holds cash + credit). */
  get salesCount(): number {
    return this.report?.cashSalesDetails?.length ?? 0;
  }

  /** Cash share of total sales as 0-100, for the split bar. */
  get cashShare(): number {
    const total = Number(this.report?.totalSales ?? 0);
    if (!total) return 0;
    const cash = Number(this.report?.cashSales ?? 0);
    return Math.min(100, Math.max(0, (cash / total) * 100));
  }

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
