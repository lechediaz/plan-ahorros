import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NeedsBasicInfoGuard } from './guards/needs-basic-info.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [NeedsBasicInfoGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'my-plans',
    canActivate: [NeedsBasicInfoGuard],
    loadChildren: () =>
      import('./pages/my-plans/my-plans.module').then(
        (m) => m.MyPlansPageModule
      ),
  },
  {
    path: 'create-plan',
    canActivate: [NeedsBasicInfoGuard],
    loadChildren: () =>
      import('./pages/create-plan/create-plan.module').then(
        (m) => m.CreatePlanPageModule
      ),
  },
  {
    path: 'update-plan',
    canActivate: [NeedsBasicInfoGuard],
    loadChildren: () =>
      import('./pages/update-plan/update-plan.module').then(
        (m) => m.UpdatePlanPageModule
      ),
  },
  {
    path: 'basic-info',
    loadChildren: () =>
      import('./pages/basic-info/basic-info.module').then(
        (m) => m.BasicInfoPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
