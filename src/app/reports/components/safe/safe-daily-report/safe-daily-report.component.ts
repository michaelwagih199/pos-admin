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

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
