import { Component, OnInit } from '@angular/core';
import { MaintanenceModel } from 'src/app/maintainence/models/maintanceObject';
import { POS_Response } from '../../../../../_helpers/pos-responce';
import { MaintanenceService } from '../../../../../maintainence/services/maintanence.service';

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
</mat-tab-group>

  `,
  styles: [
  ]
})
export class NotificationsComponent implements OnInit {

  today!: POS_Response<Array<MaintanenceModel>>;
  tomorrow!: POS_Response<Array<MaintanenceModel>>;

  constructor(private MaintanenceService: MaintanenceService) { }

  ngOnInit(): void {
    this.getMatinatnceToday();
    this.getMatinatnceTomorrow();
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

}
