import {
  AfterViewChecked,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/service/data.service';
import { Arabic } from 'src/app/text';
import { POS_Response } from '../../_helpers/pos-responce';
import { SaleOrderInvoceModel } from '../model/saleOrderInvocesModel';


@Component({
  selector: 'app-recipt-report',
  templateUrl: './recipt-report.component.html',
  styleUrls: ['./recipt-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReciptReportComponent
  implements OnInit, OnDestroy, AfterViewChecked {


  subscription!: Subscription;

  arabic: Arabic = new Arabic();

  sharedData: POS_Response<SaleOrderInvoceModel> | undefined;

  constructor(
    private router: Router,
    private data: DataService
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngAfterViewChecked(): Promise<void> {
    await this.sleep(1000);
    window.print();
  }

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe((message) => {
      this.sharedData = message
    });
  }

  @HostListener('window:afterprint')
  onafterprint() {
    this.toSaleOrder('saleOrder')
  }



  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  toSaleOrder(val: any) {
    this.redirectTo(`/${val}`);
  }

  sleep(ms: any) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
