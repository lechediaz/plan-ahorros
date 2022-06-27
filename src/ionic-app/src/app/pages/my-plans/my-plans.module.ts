import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPlansPageRoutingModule } from './my-plans-routing.module';

import { MyPlansPage } from './my-plans.page';
import { EmptyMessageModule } from '../../components/empty-message/empty-message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPlansPageRoutingModule,
    EmptyMessageModule,
  ],
  declarations: [MyPlansPage],
})
export class MyPlansPageModule {}
