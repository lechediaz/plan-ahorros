import { FeeCardComponent } from './fee-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FeeCardComponent],
  exports: [FeeCardComponent],
  imports: [CommonModule],
})
export class FeeCardModule {}
