import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent implements OnInit {
  constructor(private router: Router) {}

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
  
}
