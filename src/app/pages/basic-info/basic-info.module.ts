import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasicInfoPageRoutingModule } from './basic-info-routing.module';

import { BasicInfoPage } from './basic-info.page';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BasicInfoPageRoutingModule,
    ReactiveFormsModule,
    HeaderModule,
  ],
  declarations: [BasicInfoPage],
})
export class BasicInfoPageModule {}
