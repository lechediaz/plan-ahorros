import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { EmptyMessageModule } from '../../components/empty-message/empty-message.module';
import { FeeCardModule } from '../../components/fee-card/fee-card.module';
import { HeaderModule } from '../../components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    EmptyMessageModule,
    FeeCardModule,
    HeaderModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
