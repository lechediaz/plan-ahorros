import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NeedsBasicInfoGuard } from './guards/needs-basic-info.guard';
import { ROUTES } from './constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.HOME,
    pathMatch: 'full',
  },
  {
    path: ROUTES.HOME,
    canActivate: [NeedsBasicInfoGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: ROUTES.MY_PLANS,
    canActivate: [NeedsBasicInfoGuard],
    loadChildren: () =>
      import('./pages/my-plans/my-plans.module').then(
        (m) => m.MyPlansPageModule
      ),
  },
  {
    path: ROUTES.CREATE_PLAN,
    canActivate: [NeedsBasicInfoGuard],
    loadChildren: () =>
      import('./pages/create-plan/create-plan.module').then(
        (m) => m.CreatePlanPageModule
      ),
  },
  {
    path: ROUTES.UPDATE_PLAN,
    canActivate: [NeedsBasicInfoGuard],
    loadChildren: () =>
      import('./pages/update-plan/update-plan.module').then(
        (m) => m.UpdatePlanPageModule
      ),
  },
  {
    path: ROUTES.BASIC_INFO,
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
