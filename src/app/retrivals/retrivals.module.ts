import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetrivalsRoutingModule } from './retrivals-routing.module';
import { RetrivalsComponent } from './components/retrivals/retrivals.component';
import { SharedModule } from '../shared/shared.module';
import { RerivalDetailsComponent } from './dialgos/rerival-details/rerival-details.component';
import { CreateRetrivalsComponent } from './dialgos/create-retrivals/create-retrivals.component';


@NgModule({
  declarations: [RetrivalsComponent, RerivalDetailsComponent, CreateRetrivalsComponent],
  imports: [
    CommonModule,
    RetrivalsRoutingModule,
    SharedModule
  ]
})
export class RetrivalsModule { }
