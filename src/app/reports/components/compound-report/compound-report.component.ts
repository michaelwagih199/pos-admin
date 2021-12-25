import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { ExcelService } from 'src/app/excel.service';
import { CompoundReportModel } from '../../models/compoundModel';
import { CompoundService } from '../../service/compound.service';

@Component({
  selector: 'app-compound-report',
  templateUrl: './compound-report.component.html',
  styleUrls: ['./compound-report.component.scss'],
})
export class CompoundReportComponent implements OnInit {
  startDate: any;
  endDate: any;
  compound!: CompoundReportModel;

  constructor(private compoundService: CompoundService,
   ) {}
  ngOnInit(): void {}

  getReport() {
    this.compoundService
      .getCompound(this.formatDate(this.startDate), this.formatDate(this.endDate))
      .subscribe((data) => {
        this.compound = data;
      });
  }


 
  formatDate(date:any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }


  
}
