import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPlansPageRoutingModule } from './my-plans-routing.module';

import { MyPlansPage } from './my-plans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPlansPageRoutingModule
  ],
  declarations: [MyPlansPage]
})
export class MyPlansPageModule {}
