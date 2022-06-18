import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartAppPageRoutingModule } from './start-app-routing.module';

import { StartAppPage } from './start-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartAppPageRoutingModule
  ],
  declarations: [StartAppPage]
})
export class StartAppPageModule {}
