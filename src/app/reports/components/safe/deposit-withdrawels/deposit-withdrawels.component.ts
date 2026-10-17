import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositdService } from 'src/app/reports/service/deposit.service';
import { WithdrawlsService } from 'src/app/reports/service/withdrawls.service';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { Arabic } from 'src/app/text';

export class DepositModel {
  id!: number;
  depositName!: string;
  depositValue!: number;
  createdDate!: string;
  isArchived!: boolean;
}

export class WithdrawalModel {
  id!: number;
  withdrawalName!: string;
  withdrawalValue!: number;
  createdDate!: string;
  isArchived!: boolean;
}

@Component({
  selector: 'app-deposit-withdrawels',
  templateUrl: './deposit-withdrawels.component.html',
  styleUrls: ['./deposit-withdrawels.component.scss'],
})
export class DepositWithdrawelsComponent implements OnInit {
  quantityValidateForm!: FormGroup;
  withdrawalValidateForm!: FormGroup;
  arabic: Arabic = new Arabic();
  isLoading: boolean = false;
  depositList!: DepositModel[];
  withdrawalList!: WithdrawalModel[];
  deposit: DepositModel = new DepositModel();
  withdrawl: WithdrawalModel = new WithdrawalModel();

  depositSaveCheck = 'حفظ';
  withdrawlSaveCheck = 'حفظ';

  displayedColumns: string[] = ['id', 'date', 'name', 'value', 'actions'];

  constructor(
    private depositeService: DepositdService,
    private withDrawlService: WithdrawlsService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDeposit();
    this.getWithDrawls();
    this.validateform();
  }

  //events
  editeDeposit(item: DepositModel, content: any) {
    this.depositSaveCheck = 'تعديل';
    this.deposit = item;
    this.modalService.open(content);
  }

  deleteDeposit(obj: DepositModel) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.depositName}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`,
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.depositeService.delete(obj.id).subscribe(
          (data) => {
            this.openSnackBar(
              `${this.arabic.stock.category.util.dialog.notification.deleted}`,
              ''
            );
            this.getDeposit();
          },
          (error) => console.log(error)
        );
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  onDepositSave() {
    if (this.depositSaveCheck == 'حفظ') {
      this.depositeService.create(this.deposit).subscribe((data) => {
        this.openSnackBar('تم الحفظ', '');
        this.getDeposit();
        this.modalService.dismissAll();
      });
    } else {
      this.depositeService
        .update(this.deposit.id, this.deposit)
        .subscribe((data) => {
          this.openSnackBar('تم الحفظ', '');
          this.getDeposit();
          this.modalService.dismissAll();
        });
    }
  }

  openDepositModal(content: any) {
    this.deposit = new DepositModel();
    this.depositSaveCheck = 'حفظ';
    this.modalService.open(content);
  }

  openWithdrawalModal(content: any) {
    this.withdrawl = new WithdrawalModel();
    this.withdrawlSaveCheck = 'حفظ';
    this.modalService.open(content);
  }

  editeWithdrawalModel(element: WithdrawalModel, content: any) {
    this.withdrawlSaveCheck = 'تعديل';
    this.withdrawl = element;
    this.modalService.open(content);
  }

  deleteWithdrawal(element: WithdrawalModel) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${element.withdrawalName}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`,
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.withDrawlService.delete(element.id).subscribe(
          (data) => {
            this.openSnackBar(
              `${this.arabic.stock.category.util.dialog.notification.deleted}`,
              ''
            );
            this.getWithDrawls();
          },
          (error) => console.log(error)
        );
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  onWithdralSave() {
    if (this.withdrawlSaveCheck == 'حفظ') {
      this.withDrawlService.create(this.withdrawl).subscribe((data) => {
        this.openSnackBar('تم الحفظ', '');
        this.getWithDrawls();
        this.modalService.dismissAll();
      });
    } else {
      this.withDrawlService
        .update(this.withdrawl.id, this.withdrawl)
        .subscribe((data) => {
          this.openSnackBar('تم الحفظ', '');
          this.getWithDrawls();
          this.modalService.dismissAll();
        });
    }
  }

  /**
   * data
   */

  getDeposit() {
    this.isLoading = true;
    this.depositeService.getDeposit().subscribe((data) => {
      this.depositList = data;
      this.isLoading = false;
    });
  }

  getWithDrawls() {
    this.isLoading = true;
    this.withDrawlService.getAll().subscribe((data) => {
      this.withdrawalList = data;
      this.isLoading = false;
    });
  }

  validateform() {
    this.quantityValidateForm = this.fb.group({
      depositName: ['', [Validators.required]],
      depositValue: ['', [Validators.required]],
    });

    this.withdrawalValidateForm = this.fb.group({
      withdrawalValue: ['', [Validators.required]],
      withdrawalName: ['', [Validators.required]],
    });
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
