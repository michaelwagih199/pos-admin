import { Component, OnInit } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ExpensesCategoryComponent } from '../expenses-category/expenses-category.component';
import { ExpensesListComponent } from '../expenses-list/expenses-list.component';

@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss'],
    imports: [MatTabGroup, MatTab, ExpensesCategoryComponent, ExpensesListComponent]
})
export class ExpensesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
