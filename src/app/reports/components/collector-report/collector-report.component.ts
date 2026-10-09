import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/excel.service';
import { Arabic } from 'src/app/text';
import { CollectorReportRow, CollectorReportService } from '../../service/collector-report.service';

@Component({
  selector: 'app-collector-report',
  templateUrl: './collector-report.component.html',
  styleUrls: ['./collector-report.component.scss'],
})
export class CollectorReportComponent implements OnInit {
  arabic: Arabic = new Arabic();
  now: Date = new Date();

  displayedColumns: string[] = [
    'index',
    'customerName',
    'lastPaymentDate',
    'collectedAmount',
    'totalRemainingDebt',
  ];

  rows: CollectorReportRow[] = [];
  isLoading = false;
  loaded = false;

  totalCollected = 0;
  customerCount = 0;

  constructor(
    private collectorService: CollectorReportService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;

    this.collectorService.getReport().subscribe({
      next: (data) => {
        this.rows = data || [];
        this.totalCollected = this.rows.reduce(
          (sum, row) => sum + (Number(row.collectedAmount) || 0),
          0
        );
        this.customerCount = this.rows.length;
        this.isLoading = false;
        this.loaded = true;
      },
      error: (err) => {
        console.error(err);
        this.rows = [];
        this.totalCollected = 0;
        this.customerCount = 0;
        this.isLoading = false;
        this.loaded = true;
      },
    });
  }

  exportToExcel(): void {
    if (!this.rows.length) {
      return;
    }


    const data = this.rows.map((row) => ({
      'العميل': row.customerName,
      'الهاتف': row.customerPhone || '',
      'آخر دفعة': row.lastPaymentDate
        ? new Date(row.lastPaymentDate).toLocaleDateString('ar-EG')
        : '-',
      'إجمالي المحصل': row.collectedAmount,
      'المديونية': row.totalRemainingDebt,
    }));

    this.excelService.exportAsExcelFile(data, 'collector-report');
  }

  print(): void {
    window.print();
  }
}
