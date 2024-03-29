import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicInfoPage } from './basic-info.page';

const routes: Routes = [
  {
    path: '',
    component: BasicInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicInfoPageRoutingModule {}
