import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasicInfoPageRoutingModule } from './basic-info-routing.module';

import { BasicInfoPage } from './basic-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BasicInfoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [BasicInfoPage],
})
export class BasicInfoPageModule {}
