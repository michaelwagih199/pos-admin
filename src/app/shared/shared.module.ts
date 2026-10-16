import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import * as fromComponents from './components';
import { AboutAppDialogComponent } from './components/layout/dialog/about-app-dialog/about-app-dialog.component';
import { ConfirmationDialog } from './components/layout/dialog/confirmation/confirmation.component';
import { NotificationsComponent } from './components/layout/dialog/notifications/notifications.component';
import { NotFoundComponent } from './components/layout/not-found/not-found.component';
import { NgMaterialModule } from './components/ng-material/ng-material.module';
import { SharedRoutingModule } from './shared-routing.module';


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
    NgbCarouselModule,
    NotificationsComponent
  ],
})
export class SharedModule { }
