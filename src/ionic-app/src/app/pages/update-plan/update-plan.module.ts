import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePlanPageRoutingModule } from './update-plan-routing.module';

import { UpdatePlanPage } from './update-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatePlanPageRoutingModule
  ],
  declarations: [UpdatePlanPage]
})
export class UpdatePlanPageModule {}
