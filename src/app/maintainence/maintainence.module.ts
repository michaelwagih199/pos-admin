import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintainenceRoutingModule } from './maintainence-routing.module';
import { MaintanenceComponent } from './maintanence/maintanence.component';
import { SharedModule } from '../shared/shared.module';
import { CreateMaintanenceComponent } from './dialogs/create-maintanence.component';

@NgModule({
    imports: [
        CommonModule,
        MaintainenceRoutingModule,
        SharedModule,
        MaintanenceComponent, CreateMaintanenceComponent
    ]
})
export class MaintainenceModule { }
