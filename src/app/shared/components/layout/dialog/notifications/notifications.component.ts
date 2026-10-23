import { Component, OnInit, inject } from '@angular/core';
import { MaintanenceModel } from 'src/app/maintainence/models/maintanceObject';
import { POS_Response } from '../../../../../_helpers/pos-responce';
import { MaintanenceService } from '../../../../../maintainence/services/maintanence.service';
import { ExpiredProductModel } from './models/notification-model';
import { NotificationService } from './services/notification.service';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-notifications',
    template: `
<h2 mat-dialog-title>الإشعارات والتنبيهات</h2>

<mat-dialog-content>
  <mat-tab-group>
    <mat-tab label="الصيانة اليوم والغد">
      <div class="mt-3 text-center">
        <h5 class="fw-bold text-navy mb-2">صيانات اليوم</h5>
        <table class="table table-bordered table-sm mb-4">
          <thead>
            <tr>
              <th>العميل</th>
              <th>التاريخ</th>
              <th>ملاحظة</th>
            </tr>
          </thead>
          <tbody>
            @for (item of today?.data; track item) {
              <tr>
                <td>{{ item.customerName}}</td>
                <td class="t-num">{{ item.maintanenceDate | date: 'yyyy-MM-dd' }}</td>
                <td>{{ item.comment}}</td>
              </tr>
            }
            @if (!today?.data?.length) {
              <tr><td colspan="3" class="text-muted py-3">لا توجد صيانات اليوم</td></tr>
            }
          </tbody>
        </table>
      </div>

      <div class="mt-3 text-center">
        <h5 class="fw-bold text-navy mb-2">صيانات غداً</h5>
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>العميل</th>
              <th>التاريخ</th>
              <th>ملاحظة</th>
            </tr>
          </thead>
          <tbody>
            @for (item of tomorrow?.data; track item) {
              <tr>
                <td>{{ item.customerName}}</td>
                <td class="t-num">{{ item.maintanenceDate | date: 'yyyy-MM-dd'}}</td>
                <td>{{ item.comment}}</td>
              </tr>
            }
            @if (!tomorrow?.data?.length) {
              <tr><td colspan="3" class="text-muted py-3">لا توجد صيانات غداً</td></tr>
            }
          </tbody>
        </table>
      </div>
    </mat-tab>

    <mat-tab label="المنتجات منتهية الصلاحية">
      <div class="mt-3 text-center">
        <h5 class="fw-bold text-danger mb-2">منتجات منتهية الصلاحية</h5>
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>الكود</th>
              <th>الاسم</th>
              <th>تاريخ الانتهاء</th>
            </tr>
          </thead>
          <tbody>
            @for (item of expiredProducts?.data; track item) {
              <tr>
                <td class="fw-bold t-num">{{ item.productCode}}</td>
                <td>{{ item.productName}}</td>
                <td class="t-num">{{ item.expirationDate | date: 'yyyy-MM-dd' }}</td>
              </tr>
            }
            @if (!expiredProducts?.data?.length) {
              <tr><td colspan="3" class="text-muted py-3">لا توجد منتجات منتهية الصلاحية</td></tr>
            }
          </tbody>
        </table>
      </div>
    </mat-tab>
  </mat-tab-group>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-raised-button color="primary" (click)="close()">إغلاق</button>
</mat-dialog-actions>
`,
    styles: [`
      :host { display: block; width: 100%; }
      .text-navy { color: var(--vn-brand); }
    `],
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatTabGroup, MatTab, DatePipe]
})
export class NotificationsComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<NotificationsComponent>);

  close() {
    this.dialogRef.close();
  }
  private MaintanenceService = inject(MaintanenceService);
  private notificationService = inject(NotificationService);


  today?: POS_Response<Array<MaintanenceModel>>;
  tomorrow?: POS_Response<Array<MaintanenceModel>>;
  expiredProducts?: POS_Response<Array<ExpiredProductModel>>;

  ngOnInit(): void {
    this.getMatinatnceToday();
    this.getMatinatnceTomorrow();
    this.getExpiredProduct();
  }


  getMatinatnceTomorrow() {
    this.MaintanenceService.findTomorrow().subscribe(response => {
      this.tomorrow = response
    }, error => {
      console.log(error);
    });
  }

  getMatinatnceToday() {
    this.MaintanenceService.findToday().subscribe(response => {
      this.today = response
    }, error => {
      console.log(error);
    });
  }

  getExpiredProduct() {
    this.notificationService.getExpiredProduct().subscribe(response => {
      this.expiredProducts = response
    }, error => {
      console.log(error);
    });
  }



}
