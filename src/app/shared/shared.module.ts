import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import * as fromComponents from './components';
import { NgMaterialModule } from './components/ng-material/ng-material.module';
import { ConfirmationDialog } from './components/layout/dialog/confirmation/confirmation.component';
import { AboutAppDialogComponent } from './components/layout/dialog/about-app-dialog/about-app-dialog.component';
import { NgZorroModule } from './components/ng-zorro/ng-zorro.module';
import { NgbCarouselModule, NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsComponent } from './components/layout/dialog/notifications/notifications.component';
import { NotFoundComponent } from './components/layout/not-found/not-found.component';


@NgModule({
  declarations: [...fromComponents.components, ConfirmationDialog, AboutAppDialogComponent, NotificationsComponent, NotFoundComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    NgMaterialModule,
    NgxPaginationModule,
    NgZorroModule,
    NgbCarouselModule
   ],
  exports: [   
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    CommonModule,
    NgMaterialModule,
    NgxPaginationModule,
    NgZorroModule,
    NgbCarouselModule,
    NotificationsComponent

  ]
})
export class SharedModule { }
