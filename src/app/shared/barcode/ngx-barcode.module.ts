import { FormsModule } from '@angular/forms';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { NgxBarcodeComponent } from './ngx-barcode.component';

export * from './ngx-barcode.component';

/** Local drop-in replacement for the abandoned `ngx-barcode` package. */

@NgModule({
  declarations: [NgxBarcodeComponent],
  exports: [NgxBarcodeComponent],
  imports: [FormsModule],
})
export class NgxBarcodeModule {
  static forRoot(): ModuleWithProviders<NgxBarcodeModule> {
    return { ngModule: NgxBarcodeModule, providers: [] as Type<unknown>[] };
  }
}
