import {
  AfterViewChecked,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/service/data.service';
import { BarCodeService } from '../service/bar-code.service';
import * as printJS from "print-js";


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
export class ParcodeComponent implements OnInit {
  subscription!: Subscription;

  sharedData!: data;

  constructor(private router: Router, private data: DataService,     private _snackBar: MatSnackBar, private barCodeService :BarCodeService) {}

  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe((message) => {
      this.sharedData = message;      
    });

    if (this.sharedData.parcode) {
      this.barCodeService.printBarCode(this.sharedData.parcode).subscribe(
        response => {
          let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
          const blobUrl = URL.createObjectURL(blob);
          printJS(blobUrl);
          this.toSaleOrder('stock');
        },
        error => {
          console.log(error);
          this.openSnackBar(error.message, "error");
        }
      );
    }

  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
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
