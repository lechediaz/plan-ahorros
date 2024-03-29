import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePlanPage } from './update-plan.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePlanPageRoutingModule {}
