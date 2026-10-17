import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SupliersService } from '../../service/supliers.service';
import { Supplier } from '../../models/supplier';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { SupliersPaymentComponent } from '../supliers-payment/supliers-payment.component';
import { SupplierOrdersComponent } from '../supplier-orders/supplier-orders.component';

@Component({
    selector: 'app-supplier-details',
    templateUrl: './supplier-details.component.html',
    styleUrls: ['./supplier-details.component.scss'],
    imports: [MatCard, MatCardHeader, MatIconButton, MatIcon, MatCardContent, MatTabGroup, MatTab, SupliersPaymentComponent, SupplierOrdersComponent]
})
export class SupplierDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supliersService = inject(SupliersService);


  supplierId!: number
  private routeSub!: Subscription;
  supplier: Supplier = new Supplier()

  ngOnInit(): void {
    this.getSupplierId()
    this.findBySupplierId()
  }

  getSupplierId() {
    this.routeSub = this.route.params.subscribe(params => {
      this.supplierId = params['id']
    });
  }

  findBySupplierId() {
    this.supliersService.findById(this.supplierId).subscribe(data => {
      this.supplier = data
    }, error => console.log(error))
  }

  back() {
    this.router.navigate([`suppliers`])
  }

}
