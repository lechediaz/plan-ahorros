import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';

// Constants
import { SQLITE } from '../constants';

// Models
import { SavingPlan } from '../models';

// Services
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class SavingPlanService {
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService
  ) {}

  /** SQL string to query a saving plan by id. */
  private readonly SELECT_SAVING_PLAN_BY_ID = `SELECT * FROM ${SQLITE.TABLE_SAVING_PLAN} WHERE id = ?`;

  /** SQL string to query all saving plans. */
  private readonly SELECT_ALL_SAVING_PLANs = `SELECT * FROM ${SQLITE.TABLE_SAVING_PLAN} ORDER BY goal`;

  /**
   * Gets a saving plan by Id.
   * @param id The saving plan id.
   * @returns The saving plan.
   */
  getSavingPlanById = async (id: number | string) => {
    let savingPlan: SavingPlan | any = null;

    if (this.platform.is('cordova')) {
      savingPlan = await this.getSavingPlanByIdFromDevice(id);
    } else {
      savingPlan = this.getSavingPlanByIdFromBrowser(id);
    }

    return savingPlan;
  };

  /**
   * Gets a saving plan by Id from the device.
   * @param id The saving plan id.
   * @returns The saving plan.
   */
  private getSavingPlanByIdFromDevice = async (id: number | string) => {
    const resultQuery = await this.databaseService.storage.executeSql(
      this.SELECT_SAVING_PLAN_BY_ID,
      [id]
    );

    let savingPlan = null;

    if (resultQuery.rows.length > 0) {
      savingPlan = resultQuery.rows.item(0);
    }

    return savingPlan;
  };

  /**
   * Gets a saving plan by Id from the browser.
   * @param id The saving plan id.
   * @returns The saving plan.
   */
  private getSavingPlanByIdFromBrowser = (id: number | string) => {
    let savingPlan = localStorage.getItem(this.buildkey(id));

    if (typeof savingPlan === 'string') {
      savingPlan = JSON.parse(savingPlan);
    }

    return savingPlan;
  };

  /**
   * Gets all the saving plans.
   * @returns All the saving plans.
   */
  getAllSavingPlans = async () => {
    let plans: SavingPlan[] | any[] = [];

    if (this.platform.is('cordova')) {
      plans = await this.getAllSavingPlansFromDevice();
    } else {
      plans = this.getAllSavingPlansFromBrowser();
    }

    return plans;
  };

  /**
   * Gets all the saving plans from the device.
   * @returns All the saving plans from the device.
   */
  private getAllSavingPlansFromDevice = async () => {
    const resultQuery = await this.databaseService.storage.executeSql(
      this.SELECT_ALL_SAVING_PLANs,
      []
    );

    let savingPlans = [];

    if (resultQuery.rows.length > 0) {
      for (let index = 0; index < resultQuery.rows.length; index++) {
        const savingPlan = resultQuery.rows.item(index);

        savingPlans.push(savingPlan);
      }
    }

    return savingPlans;
  };

  /**
   * Gets all the saving plans from the browser.
   * @returns All the saving plans from the browser.
   */
  private getAllSavingPlansFromBrowser = () => {
    const savingPlans = Object.entries(localStorage)
      .filter(([key, value]) => key.startsWith(SQLITE.TABLE_SAVING_PLAN))
      .map(([key, value]) => JSON.parse(value));

    return savingPlans;
  };

  /**
   * Creates a new saving plan.
   * @param savingPlan The saving plan.
   */
  createSavingPlan = async (savingPlan: SavingPlan) => {
    if (this.platform.is('cordova')) {
      await this.createSavingPlanOnDevice(savingPlan);
    } else {
      this.createSavingPlanOnBrowser(savingPlan);
    }
  };

  /**
   * Creates a new saving plan on the device.
   * @param savingPlan The saving plan on the device.
   */
  private createSavingPlanOnDevice = async (savingPlan: SavingPlan) => {
    const insertSQL = `INSERT INTO ${SQLITE.TABLE_SAVING_PLAN} (
      income,
      interval,
      amount_to_save,
      bills,
      years,
      goal,
      fee,
      status
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )`;

    const resultInsert = await this.databaseService.storage.executeSql(
      insertSQL,
      [
        savingPlan.income,
        savingPlan.interval,
        savingPlan.amount_to_save,
        savingPlan.bills,
        savingPlan.years,
        savingPlan.goal,
        savingPlan.fee,
        savingPlan.status,
      ]
    );

    console.log(
      `${SQLITE.TABLE_SAVING_PLAN}: ${resultInsert.rowsAffected} records inserted`
    );
  };

  /**
   * Creates a new saving plan on the browser.
   * @param savingPlan The saving plan on the browser.
   */
  private createSavingPlanOnBrowser = (savingPlan: SavingPlan) => {
    let keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(SQLITE.TABLE_SAVING_PLAN)
    );

    savingPlan.id = this.getnewId(keys);

    const planstring = JSON.stringify(savingPlan);

    localStorage.setItem(this.buildkey(savingPlan.id), planstring);
  };

  /**
   * Updates a saving plan.
   * @param savingPlan The saving plan.
   */
  updateSavingPlan = async (savingPlan: SavingPlan) => {
    if (this.platform.is('cordova')) {
      await this.updateSavingPlanOnDevice(savingPlan);
    } else {
      this.updateSavingPlanOnBrowser(savingPlan);
    }
  };

  /**
   * Updates a saving plan on the device.
   * @param savingPlan The saving plan on the device.
   */
  private updateSavingPlanOnDevice = async (savingPlan: SavingPlan) => {
    const updateSQL = `UPDATE ${SQLITE.TABLE_SAVING_PLAN} SET
      income = ?,
      interval = ?,
      amount_to_save = ?,
      bills = ?,
      years = ?,
      goal = ?,
      fee = ?,
      status = ?
    WHERE id = ?`;

    const resultUpdate = await this.databaseService.storage.executeSql(
      updateSQL,
      [
        savingPlan.income,
        savingPlan.interval,
        savingPlan.amount_to_save,
        savingPlan.bills,
        savingPlan.years,
        savingPlan.goal,
        savingPlan.fee,
        savingPlan.status,
        savingPlan.id,
      ]
    );

    console.log(
      `${SQLITE.TABLE_SAVING_PLAN}: ${resultUpdate.rowsAffected} records updated`
    );
  };

  /**
   * Updates a saving plan on the browser.
   * @param savingPlan The saving plan on the browser.
   */
  private updateSavingPlanOnBrowser = (savingPlan: SavingPlan) => {
    const planstring = JSON.stringify(savingPlan);

    localStorage.setItem(this.buildkey(savingPlan.id), planstring);
  };

  /**
   * Deletes a saving plan.
   * @param savingPlan The saving plan.
   */
  deleteSavingPlan = async (savingPlan: SavingPlan) => {
    if (this.platform.is('cordova')) {
      await this.deleteSavingPlanFromDevice(savingPlan);
    } else {
      this.deleteSavingPlanFromBrowser(savingPlan);
    }
  };

  /**
   * Deletes a saving plan from the device.
   * @param savingPlan The saving plan.
   */
  private deleteSavingPlanFromDevice = async (savingPlan: SavingPlan) => {
    const deleteSQL = `DELETE FROM ${SQLITE.TABLE_SAVING_PLAN} WHERE id = ?`;

    const resultDelete = await this.databaseService.storage.executeSql(
      deleteSQL,
      [savingPlan.id]
    );

    console.log(
      `${SQLITE.TABLE_SAVING_PLAN}: ${resultDelete.rowsAffected} records deleted`
    );
  };

  /**
   * Deletes a saving plan from the browser.
   * @param savingPlan The saving plan.
   */
  private deleteSavingPlanFromBrowser = (savingPlan: SavingPlan) =>
    localStorage.removeItem(this.buildkey(savingPlan.id));

  /**
   * Autoincrements id from localstorage keys.
   * @param keys Array of localstorage keys.
   * @returns New Id.
   */
  private getnewId(keys: string[] | any) {
    let ids = [0];

    if (keys.length > 0) {
      ids = keys.map((k) => {
        const idString = k.substring(k.indexOf('.') + 1);
        const id = parseInt(idString);

        return id;
      });
    }

    const maxId = Math.max(...ids);
    const newId = maxId + 1;

    return newId;
  }

  /**
   * Creates a key from a Id.
   * @param id The id.
   * @returns Key from Id.
   */
  private buildkey = (id: number | string) =>
    `${SQLITE.TABLE_SAVING_PLAN}.${id}`;
}
