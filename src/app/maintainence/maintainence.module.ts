import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintainenceRoutingModule } from './maintainence-routing.module';
import { MaintanenceComponent } from './maintanence/maintanence.component';
import { SharedModule } from '../shared/shared.module';
import { CreateMaintanenceComponent } from './dialogs/create-maintanence.component';

@NgModule({
  declarations: [MaintanenceComponent, CreateMaintanenceComponent],
  imports: [
    CommonModule,
    MaintainenceRoutingModule,
    SharedModule
  ]
})
export class MaintainenceModule { }
