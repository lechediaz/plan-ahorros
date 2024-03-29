import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePlanPageRoutingModule } from './update-plan-routing.module';

import { UpdatePlanPage } from './update-plan.page';

import { HeaderModule } from '../../components/header/header.module';
import { PlanFormModule } from '../../components/plan-form/plan-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatePlanPageRoutingModule,
    HeaderModule,
    PlanFormModule,
  ],
  declarations: [UpdatePlanPage],
})
export class UpdatePlanPageModule {}
