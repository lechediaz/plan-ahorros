import { PlanFormModule } from '../../components/plan-form/plan-form.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePlanPageRoutingModule } from './create-plan-routing.module';

import { CreatePlanPage } from './create-plan.page';

import { HeaderModule } from '../../components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePlanPageRoutingModule,
    PlanFormModule,
    HeaderModule,
  ],
  declarations: [CreatePlanPage],
})
export class CreatePlanPageModule {}
