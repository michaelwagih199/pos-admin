import { ProfitModel } from './../../../models/profit';
import { Component, OnInit } from '@angular/core';
import { ProfitServiceService } from 'src/app/reports/service/profit-service.service';

@Component({
  selector: 'app-profits',
  templateUrl: './profits.component.html',
  styleUrls: ['./profits.component.scss'],
})
export class ProfitsComponent implements OnInit {
  profit!: ProfitModel;
  isLoading: boolean = false;
  netProfit: number = 0;
  netProfitPercentage = 0

  constructor(private profitService: ProfitServiceService) {}
  startDate: any;
  endDate: any;

  ngOnInit(): void {}

  /**
   * data
   */

  getReport() {
    this.isLoading = true;
    this.profitService
      .getProfit(this.formatDate(this.startDate), this.formatDate(this.endDate))
      .subscribe((data) => {
        this.isLoading = false;
        this.profit = data;
        this.netProfit = 
        (this.profit.sumRevenues - this.profit.sumRetrivals) - (this.profit.sumExpenses + this.profit.valueOfSalesGoods - this.profit.valueOfRetrivalGoods)
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
