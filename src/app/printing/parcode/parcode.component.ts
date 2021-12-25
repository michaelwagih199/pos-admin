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

export interface data {
  parcode: any;
  name: any;
  price: any;
}

@Component({
  selector: 'app-parcode',
  templateUrl: './parcode.component.html',
  styleUrls: ['./parcode.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class ParcodeComponent implements OnInit, OnDestroy, AfterViewChecked {
  subscription!: Subscription;

  sharedData!: data;

  constructor(private router: Router, private data: DataService) {}

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe((message) => {
      this.sharedData = message;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    window.print();
  }

  @HostListener('window:afterprint')
  onBeforePrint() {
    this.toSaleOrder('stock');
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  toSaleOrder(val: any) {
    this.redirectTo(`/${val}`);
  }
}
