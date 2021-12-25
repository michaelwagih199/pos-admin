import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerPaymentService } from '../../service/customer-payment.service';
import { CustomerPaymentModel } from '../../model/customer-payment';
import { CustomerService } from '../../service/customer.service';
import { CustomerModel } from '../../model/customer-model';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  customerId!: number
  private routeSub!: Subscription;
  indebtedness:any = 0.0;
  remaining:any = 0.0;
  customerPayment: CustomerPaymentModel = new CustomerPaymentModel()
  customer: CustomerModel = new CustomerModel()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
  ) { }

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
