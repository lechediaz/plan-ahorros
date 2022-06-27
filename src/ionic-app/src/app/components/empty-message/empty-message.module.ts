import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyMessageComponent } from './empty-message.component';

@NgModule({
  declarations: [EmptyMessageComponent],
  imports: [CommonModule],
  exports: [EmptyMessageComponent],
})
export class EmptyMessageModule {}
