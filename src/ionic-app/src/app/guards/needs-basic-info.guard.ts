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
import { BasicInfoService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class NeedsBasicInfoGuard implements CanActivate {
  constructor(
    private router: Router,
    private basicInfoService: BasicInfoService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.basicInfoService.basicInfo.pipe(
      map((basicInfo: BasicInfo) => {
        console.log('Guard basicInfo subscription', basicInfo);
        if (basicInfo !== null) {
          return true;
        }

        return this.router.parseUrl(`/${ROUTES.BASIC_INFO}`);
      })
    );
  }
}
