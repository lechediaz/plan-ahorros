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

  getPlans = async () => {
    let plans: Plan[] = [];

    if (this.platform.is('cordova')) {
      plans = await this.getPlansFromDevice();
    } else {
      plans = this.getPlansFromBrowser();
    }

    return plans;
  };

  private getPlansFromDevice = async () => {
    let keys = await this.storage.keys();

    keys = keys.filter((k) => k.startsWith(PLANS_STORAGE_KEY));

    const plans = keys.map(async (key) => await this.storage.getItem(key));

    return plans;
  };

  private getPlansFromBrowser = () => {
    const plans = Object.entries(localStorage)
      .filter(([key, value]) => key.startsWith(PLANS_STORAGE_KEY))
      .map(([key, value]) => JSON.parse(value));

    return plans;
  };

  savePlan = async (plan: Plan) => {
    if (this.platform.is('cordova')) {
      await this.savePlanOnDevice(plan);
    } else {
      this.savePlanOnBrowser(plan);
    }
  };

  private savePlanOnDevice = async (plan: Plan) => {
    let keys = await this.storage.keys();

    keys = keys.filter((k) => k.startsWith(PLANS_STORAGE_KEY));

    const newId = this.getnewId(keys);

    plan.id = newId;

    await this.storage.setItem(this.buildkey(newId), plan);
  };

  private savePlanOnBrowser = (plan: Plan) => {
    let keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(PLANS_STORAGE_KEY)
    );

    const newId = this.getnewId(keys);

    plan.id = newId;

    const planstring = JSON.stringify(plan);

    localStorage.setItem(this.buildkey(newId), planstring);
  };

  deletePlan = async (plan: Plan) => {
    if (this.platform.is('cordova')) {
      await this.deletePlanFromDevice(plan);
    } else {
      this.deletePlanFromBrowser(plan);
    }
  };

  private deletePlanFromDevice = async (plan: Plan) =>
    await this.storage.remove(this.buildkey(plan.id));

  private deletePlanFromBrowser = (plan: Plan) =>
    localStorage.removeItem(this.buildkey(plan.id));

  private getnewId(keys: string[] | any) {
    const ids = keys.map((k) => {
      const idString = k.substring(k.indexOf('.') + 1);
      const id = parseInt(idString);

      return id;
    });

    const maxId = Math.max(...ids);

    return maxId + 1;
  }

  private buildkey = (id: number | string) => `${PLANS_STORAGE_KEY}.${id}`;
}
