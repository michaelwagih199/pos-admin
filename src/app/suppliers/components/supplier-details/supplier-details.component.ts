import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SupliersService } from '../../service/supliers.service';
import { Supplier } from '../../models/supplier';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent implements OnInit {

  supplierId!: number
  private routeSub!: Subscription;
  supplier: Supplier = new Supplier()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supliersService: SupliersService,
  ) { }

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
