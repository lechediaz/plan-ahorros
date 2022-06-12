import { PlanFormComponent } from './plan-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FeeCardModule } from './../fee-card/fee-card.module';

@NgModule({
  declarations: [PlanFormComponent],
  exports: [PlanFormComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FeeCardModule],
})
export class PlanFormModule {}
