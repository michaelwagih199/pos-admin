import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockReportService } from '../../service/stock-report.service';

@Component({
    selector: 'app-report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss'],
    standalone: false
})
export class ReportListComponent implements OnInit {
  constructor(private router: Router,private stockReportService:StockReportService) {}

  ngOnInit(): void {}

  toTresury() {
    this.router.navigateByUrl('reports/treasury');
  }

  toCompound() {
    this.router.navigateByUrl('reports/compound');
  }

  toSales(){
    this.router.navigateByUrl('reports/sales');
  }

  toProfits(){
     this.router.navigateByUrl('reports/profit');
  }
    toCollector() {
    this.router.navigateByUrl('reports/collector');
  }


 toCustomerStatement() {
    this.router.navigateByUrl('customers/statement');
  }

  toSupplierStatement() {
    this.router.navigateByUrl('reports/supplier-statement');
  }
toDailySafe() {
  this.router.navigateByUrl('reports/daily-safe');
}
openStockReport(): void {
  const w = window.open('', '_blank');
  if (!w) { alert('Please allow popups'); return; }
  w.document.write('<p style="font-family:Cairo;padding:20px;">جاري التحضير...</p>');

  const from = '2026-01-01';                     // bind to a date picker
  const to   = new Date().toISOString().split('T')[0];

  this.stockReportService.getHtml(from, to).subscribe({
    next: (html) => { w.document.open(); w.document.write(html); w.document.close(); },
    error: (e) => { w.document.write('<pre>' + e.message + '</pre>'); },
  });
}
}
