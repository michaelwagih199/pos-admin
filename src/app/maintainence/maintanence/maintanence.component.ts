import { DatePipe, AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { CreateCategoryComponent } from 'src/app/stock/dialog/create-category/create-category.component';
import { Arabic } from 'src/app/text';
import { CreateMaintanenceComponent } from '../dialogs/create-maintanence.component';
import { MaintanenceModel } from '../models/maintanceObject';
import { MaintanenceService } from '../services/maintanence.service';
import { MyUtils } from '../../_helpers/util';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatInput, MatSuffix } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';

@Component({
    selector: 'app-maintanence',
    templateUrl: './maintanence.component.html',
    styleUrls: ['./maintanence.component.scss'],
    imports: [MatCard, MatCardHeader, ReactiveFormsModule, FormsModule, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, MatIcon, MatSuffix, MatAutocomplete, MatOption, MatIconButton, MatMiniFabButton, MatCardContent, MatProgressBar, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, AsyncPipe, DatePipe]
})
export class MaintanenceComponent implements OnInit {
  private maintanenceService = inject(MaintanenceService);
  private dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);


  arabic: Arabic = new Arabic()
  maintanenceList!: MaintanenceModel[];
  maintanence: MaintanenceModel = new MaintanenceModel();
  searchInout: any
  isLoading: boolean = false
  //for tables
  displayedColumns: string[] = ['customerName', 'comment','date','actions']
  myControl = new FormControl();
  //for autocomplete
  options!: string[]
  filteredOptions!: Observable<string[]>
  pipe = new DatePipe('en-US');

  ngOnInit() {
    this.getAllNames()
    this.retrieve()
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * data
   */
  getAllNames() {
    this.maintanenceService.getNames().subscribe(response => {
      this.options = response.data
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }, error => {
      console.log(error)
    })
  }

  findByName() {
    this.isLoading = true
    this.maintanenceService.findByName(this.searchInout).subscribe(data => {
      this.maintanenceList = data.data
      this.isLoading = false
    }, error => console.log(error))
  }

  refresh() {
    this.retrieve();
    this.searchInout = ''
  }


  retrieve() {
    this.maintanenceService.findAll()
      .subscribe(
        data => {
          this.maintanenceList = data.data;
        },
        error => {
          this.isLoading = false
          console.log(error);
        });
  }


  /**
   * events
   */

  deleteDialog(action: any, obj: MaintanenceModel) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.customerName}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.maintanenceService.delete(obj.id).subscribe(data => {
          this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.deleted}`, '')
          this.retrieve()
          this.getAllNames()
        }, error => console.log(error))
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  editeDialog(action: any, obj: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: obj.id,
      description: obj.categoryName
    };
    this.dialog.open(CreateCategoryComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateCategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        console.log(data)
        // this.category.categoryName = data.description
        this.editeCategory(obj.id)
        this.getAllNames()
      }
    );
  }


  editeCategory(id: number) {
    this.maintanenceService.update(id, this.maintanence).subscribe(data => {
      this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.saved}`, '')
      this.retrieve()
    })
  }


  addCategoryDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      model: this.maintanence
    };
    const dialogRef = this.dialog.open(CreateMaintanenceComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        this.maintanence = data.model
        this.addMaintanence()
        this.getAllNames()

      }
    );
  }

  addMaintanence() {
    let myFormattedDate = this.pipe.transform(this.maintanence.maintanenceDate, 'yyyy-MM-dd');
this.maintanence?.maintanenceDate != myFormattedDate;
    this.maintanenceService.create(this.maintanence).subscribe(() => {
      this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.saved}`, '')
      this.retrieve()
    })
  }


  search() {
    this.findByName()
  }

  displayFn(value: any): string {
    console.log(value)
    this.searchInout = value
    return value;
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchInout = SelectedHuman;
    this.findByName()
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
