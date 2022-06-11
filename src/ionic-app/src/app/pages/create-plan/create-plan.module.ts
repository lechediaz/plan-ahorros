import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePlanPageRoutingModule } from './create-plan-routing.module';

import { CreatePlanPage } from './create-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePlanPageRoutingModule
  ],
  declarations: [CreatePlanPage]
})
export class CreatePlanPageModule {}
