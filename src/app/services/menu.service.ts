import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}

  private _disable = new BehaviorSubject<boolean>(false);

  disable = this._disable.asObservable();

  setDisableMenu(disable = false) {
    this._disable.next(disable);
  }
}
