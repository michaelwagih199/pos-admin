import { Component, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { CreateCategoryComponent } from 'src/app/stock/dialog/create-category/create-category.component';
import { Arabic } from 'src/app/text';
import { MaintanenceModel } from 'src/app/maintainence/models/maintanceObject';
import { MaintanenceService } from 'src/app/maintainence/services/maintanence.service';
import { CreateMaintanenceComponent } from 'src/app/maintainence/dialogs/create-maintanence.component';
import { TailerTasksServiceService } from '../../service/tailer-tasks-service.service';
import { POS_Response } from '../../../_helpers/pos-responce';
import { TailerTasksModel } from '../../model/tailer-taskMode';
import { AddTailerTasksComponent } from '../../dialog/add-tailer-tasks/add-tailer-tasks.component';

@Component({
  selector: 'app-tailer-tasks',
  templateUrl: './tailer-tasks.component.html',
  styleUrls: ['./tailer-tasks.component.scss']
})
export class TailerTasksComponent implements OnInit {

  arabic: Arabic = new Arabic()
  tailerTasksList!: TailerTasksModel[];
  tailerTasksObject: TailerTasksModel = new TailerTasksModel();
  isLoading: boolean = false
  //for tables
  displayedColumns: string[] = ['customerName', 'actions']
  myControl = new FormControl();

  constructor(
    private tailerTaskService: TailerTasksServiceService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnInit() {
    this.retrieve()
  }

  /**
   * data
   */
  retrieve() {
    this.tailerTaskService.findAll()
      .subscribe(
        response => {
          this.tailerTasksList = response.data;
        },
        error => {
          this.isLoading = false
          console.log(error);
        });
  }


  /**
   * events
   */

  deleteDialog(obj: TailerTasksModel) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.task}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.tailerTaskService.delete(obj.id).subscribe(data => {
          this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.deleted}`, '')
          this.retrieve()
        }, error => console.log(error))
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }
  
  addCategoryDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id:'',
      description: ''
    };
    const dialogRef = this.dialog.open(AddTailerTasksComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        console.log(data)
        this.tailerTasksObject.task = data.description
        this.addTaskTailer()
      }
    );
  }

  addTaskTailer() {
    this.tailerTaskService.create(this.tailerTasksObject).subscribe(() => {
      this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.saved}`, '')
      this.retrieve()
    })
  }




  /**
   * ui ux 
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }




}
