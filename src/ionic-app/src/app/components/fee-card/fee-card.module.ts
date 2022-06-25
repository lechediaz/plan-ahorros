import { FeeCardComponent } from './fee-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [FeeCardComponent],
  exports: [FeeCardComponent],
  imports: [CommonModule, IonicModule],
})
export class FeeCardModule {}
