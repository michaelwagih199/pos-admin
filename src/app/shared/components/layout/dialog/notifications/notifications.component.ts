import { Component, OnInit } from '@angular/core';
import { MaintanenceModel } from 'src/app/maintainence/models/maintanceObject';
import { POS_Response } from '../../../../../_helpers/pos-responce';
import { MaintanenceService } from '../../../../../maintainence/services/maintanence.service';
import { ExpiredProductModel } from './models/notification-model';
import { NotificationService } from './services/notification.service';


@Component({
  template: `
<style>
    .head {
        width: 50vw;
    }
</style>
<div class="head">
    <h2 mat-dialog-title>الاشعارات</h2>
    <mat-divider></mat-divider>
</div>
<mat-tab-group>
    <mat-tab label="الصيانه">
        <div class="mt-2" style="text-align: center;">
            <h2 class="border rounded bg-light text-primary">صيانات اليوم</h2>
            <!--table-->
            <table class="table table-bordered table-sm">
                <thead class="thead-light">
                    <tr>
                        <th>العميل</th>
                        <th>التاريخ</th>
                        <th>ملاحظه</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let item of today?.data">
                        <th>{{ item.customerName}}</th>
                        <th>{{ item.maintanenceDate |date: 'yyyy-MM-dd' }}</th>
                        <th>{{ item.comment}}</th>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-2" style="text-align: center;">
            <h2 class="border rounded bg-light text-primary">صيانات غداً</h2>
            <!--table-->
            <table class="table table-bordered table-sm">
                <thead class="thead-light">
                    <tr>
                        <th>العميل</th>
                        <th>التاريخ</th>
                        <th>ملاحظه</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let item of tomorrow?.data">
                        <th>{{ item.customerName}}</th>
                        <th>{{ item.maintanenceDate |date: 'yyyy-MM-dd'}}</th>
                        <th>{{ item.comment}}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </mat-tab>

    <mat-tab label="المنتجات منتهيه الصلاحية">
        <div class="mt-2" style="text-align: center;">
            <h2 class="border rounded bg-light text-blue_primary-dark">منتجات منتهيه الصلاحية</h2>
            <!--table-->
            <table class="table table-bordered table-sm">
                <thead class="thead-light">
                    <tr>
                        <th>الكود</th>
                        <th>الأسم</th>
                        <th>تاريخ الانتهاء</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let item of expiredProducts?.data">
                        <th class="text-blue_primary-dark">{{ item.productCode}}</th>
                        <th class="text-blue_primary-dark" >{{ item.productName}}</th>
                        <th class="text-blue_primary-dark" >{{ item.expirationDate | date: 'yyyy-MM-dd' }}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </mat-tab>

</mat-tab-group>
  `,
  styles: [
  ]
})
export class NotificationsComponent implements OnInit {

  today!: POS_Response<Array<MaintanenceModel>>;
  tomorrow!: POS_Response<Array<MaintanenceModel>>;
  expiredProducts!: POS_Response<Array<ExpiredProductModel>>;

  constructor(private MaintanenceService: MaintanenceService,
    private notificationService: NotificationService) { }

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
