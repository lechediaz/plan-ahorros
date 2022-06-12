import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Plan } from '../models';

const PLANS_STORAGE_KEY = 'plan';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(private platform: Platform, private storage: NativeStorage) {}

  savePlan = async (plan: Plan) => {
    debugger;
    if (this.platform.is('cordova')) {
      let keys = await this.storage.keys();

      keys = keys.filter((k) => k.startsWith(PLANS_STORAGE_KEY));

      const newId = this.getnewId(keys);

      await this.storage.setItem(`${PLANS_STORAGE_KEY}.${newId}`, plan);
    } else {
      let keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(PLANS_STORAGE_KEY)
      );

      const newId = this.getnewId(keys);
      const planstring = JSON.stringify(plan);

      localStorage.setItem(`${PLANS_STORAGE_KEY}.${newId}`, planstring);
    }
  };

  private getnewId(keys: string[] | any) {
    const maxId = Math.max(
      keys.map((k) => parseInt(k.substring(k.indexOf('.') + 1)))
    );

    return maxId + 1;
  }
}
