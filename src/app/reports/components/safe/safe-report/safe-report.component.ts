import { SafeService } from './../../../service/safe.service';
import { Component, OnInit } from '@angular/core';

export interface Income {
  sumSales: number;
  fromCustomers: number;
  incomes: number;
}

export interface Export {
  sumExpenses: number;
  sumSuppliersValues: number;
  sumExport: number;
  sumRetrivals: number;
}

@Component({
  selector: 'app-safe-report',
  templateUrl: './safe-report.component.html',
  styleUrls: ['./safe-report.component.scss'],
})
export class SafeReportComponent implements OnInit {
  isLoading: boolean = false;
  startDate: any;
  endDate: any;
  income!: Income;
  export!: Export;
  totalIncome: number =0;
  totalExport: number = 0;


  constructor(private safeService: SafeService) {}

  ngOnInit(): void {}

  getReport() {
    this.getIncome();
    this.getExport();
  }

  getIncome() {
    this.isLoading = true;
    this.safeService
      .getIncomeReport(
        this.formatDate(this.startDate),
        this.formatDate(this.endDate)
      )
      .subscribe((data) => {
        this.isLoading = false;
        this.income = data;
        this.totalIncome =
          this.income.fromCustomers +
          this.income.incomes +
          this.income.sumSales;
      });
  }

  getExport() {
    this.isLoading = true;
    this.safeService
      .getExportReport(
        this.formatDate(this.startDate),
        this.formatDate(this.endDate)
      )
      .subscribe((data) => {
        this.isLoading = false;
        this.export = data;
        this.totalExport =
          this.export.sumExpenses +
          this.export.sumExport +
          this.export.sumSuppliersValues+
          this.export.sumRetrivals
      });
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}
