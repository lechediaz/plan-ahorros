import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPlanPageRoutingModule } from './view-plan-routing.module';

import { ViewPlanPage } from './view-plan.page';

import { HeaderModule } from '../../components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPlanPageRoutingModule,
    HeaderModule,
  ],
  declarations: [ViewPlanPage],
})
export class ViewPlanPageModule {}
