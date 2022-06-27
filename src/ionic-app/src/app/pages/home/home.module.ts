import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { FeeCardModule } from '../../components/fee-card/fee-card.module';
import { EmptyMessageModule } from '../../components/empty-message/empty-message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FeeCardModule,
    EmptyMessageModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
