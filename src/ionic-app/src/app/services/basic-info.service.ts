import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { BehaviorSubject } from 'rxjs';

// Models
import { BasicInfo } from '../models';

const BASIC_INFO_STORAGE_KEY = 'basic_info';

@Injectable({
  providedIn: 'root',
})
export class BasicInfoService {
  constructor(
    private platform: Platform,
    private nativeStorage: NativeStorage
  ) {}

  private _basicInfo = new BehaviorSubject<BasicInfo>(null);
  private _basicInfoIsValid = new BehaviorSubject<boolean>(false);

  basicInfo = this._basicInfo.asObservable();
  basicInfoIsValid = this._basicInfoIsValid.asObservable();

  loadBasicInfo = async () => {
    let basicInfo: BasicInfo = {
      income: 0,
      username: 'Nombre de usuario sin definir',
    };

    let basicInfoString = '';

    if (this.platform.is('cordova')) {
      basicInfoString = await this.nativeStorage.getItem(
        BASIC_INFO_STORAGE_KEY
      );
    } else {
      basicInfoString = localStorage.getItem(BASIC_INFO_STORAGE_KEY);
    }

    if (basicInfoString != null) {
      basicInfo = JSON.parse(basicInfoString);
    }

    await this.saveBasicInfo(basicInfo);
  };

  saveBasicInfo = async (basicInfo: BasicInfo | any) => {
    if (this.platform.is('cordova')) {
      await this.nativeStorage.setItem(BASIC_INFO_STORAGE_KEY, basicInfo);
    } else {
      const basicInfoString = JSON.stringify(basicInfo);
      localStorage.setItem(BASIC_INFO_STORAGE_KEY, basicInfoString);
    }

    const basicInfoIsValid =
      basicInfo.income > 0 && basicInfo.username.length > 0;

    this._basicInfoIsValid.next(basicInfoIsValid);
    this._basicInfo.next(basicInfo);
  };
}
