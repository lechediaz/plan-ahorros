import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartAppPage } from './start-app.page';

const routes: Routes = [
  {
    path: '',
    component: StartAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartAppPageRoutingModule {}
