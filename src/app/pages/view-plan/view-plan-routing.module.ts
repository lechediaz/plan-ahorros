import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPlanPage } from './view-plan.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPlanPageRoutingModule {}
