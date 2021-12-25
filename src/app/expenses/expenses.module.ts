import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ExpensesCategoryComponent } from './components/expenses-category/expenses-category.component';
import { ExpensesListComponent } from './components/expenses-list/expenses-list.component';
import { CreateCategoryComponent } from './dialogs/create-category/create-category.component';
import { CreateExpensesComponent } from './dialogs/create-expenses/create-expenses.component';


@NgModule({
  declarations: [ExpensesComponent, ExpensesCategoryComponent, ExpensesListComponent, CreateCategoryComponent, CreateExpensesComponent],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    SharedModule
  ]
})
export class ExpensesModule { }
