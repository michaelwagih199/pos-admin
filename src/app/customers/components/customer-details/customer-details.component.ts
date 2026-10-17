import { Component, OnInit, Input, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerPaymentService } from '../../service/customer-payment.service';
import { CustomerPaymentModel } from '../../model/customer-payment';
import { CustomerService } from '../../service/customer.service';
import { CustomerModel } from '../../model/customer-model';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { PaymentsComponent } from '../payments/payments.component';
import { OrdersComponent } from '../orders/orders.component';

@Component({
    selector: 'app-customer-details',
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.scss'],
    imports: [MatCard, MatCardHeader, MatIconButton, MatIcon, MatCardContent, MatTabGroup, MatTab, PaymentsComponent, OrdersComponent]
})
export class CustomerDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);


  customerId!: number
  private routeSub!: Subscription;
  indebtedness:any = 0.0;
  remaining:any = 0.0;
  customerPayment: CustomerPaymentModel = new CustomerPaymentModel()
  customer: CustomerModel = new CustomerModel()

  ngOnInit(): void {
    this.getCustomerId()
    this.findByCustomerId()
  }

  getCustomerId() {
    this.routeSub = this.route.params.subscribe(params => {
      this.customerId = params['id']
    });
  }

  findByCustomerId() {
    this.customerService.findById(this.customerId).subscribe(data => {
      this.customer = data
    }, error => console.log(error))
  }

  back() {
    this.router.navigate([`customers`])
  }

}
