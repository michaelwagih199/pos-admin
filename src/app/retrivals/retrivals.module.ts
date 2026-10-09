import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RetrivalsRoutingModule } from './retrivals-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RetrivalsComponent } from './components/retrivals/retrivals.component';
import { RerivalDetailsComponent } from './dialgos/rerival-details/rerival-details.component';
import { ReturnProductDialogComponent } from './dialgos/return-product-dialog/return-product-dialog.component';
import { RetrievalWizardComponent } from './dialgos/retrieval-wizard/retrieval-wizard.component';

@NgModule({
  declarations: [
    RetrivalsComponent,
    RerivalDetailsComponent,
    ReturnProductDialogComponent,
    RetrievalWizardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RetrivalsRoutingModule,
    SharedModule,
  ],
})
export class RetrivalsModule {}
