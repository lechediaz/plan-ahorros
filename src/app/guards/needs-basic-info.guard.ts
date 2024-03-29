import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Constants
import { ROUTES } from '../constants';

// Models
import { BasicInfo } from '../models';

// Services
import { BasicInfoService, MenuService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class NeedsBasicInfoGuard implements CanActivate {
  constructor(
    private router: Router,
    private basicInfoService: BasicInfoService,
    private menuService: MenuService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('Guard', new Date().toLocaleTimeString());
    return this.basicInfoService.basicInfo.pipe(
      map((basicInfo: BasicInfo) => {
        if (basicInfo !== null) {
          this.menuService.setDisableMenu();

          return true;
        }

        return this.router.parseUrl(`/${ROUTES.BASIC_INFO}`);
      })
    );
  }
}
