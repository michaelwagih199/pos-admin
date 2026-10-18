import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, provideZoneChangeDetection } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { CreateCategoryComponent } from './stock/dialog/create-category/create-category.component';
import { CreateProductComponent } from './stock/dialog/create-product/create-product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBarcodeModule } from './shared/barcode/ngx-barcode.module';

import { ExcelService } from './excel.service';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';

registerLocaleData(en);

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgbModule,
        NgxBarcodeModule,
        FormsModule], providers: [
        provideZoneChangeDetection(),
        authInterceptorProviders,
        ExcelService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {}
