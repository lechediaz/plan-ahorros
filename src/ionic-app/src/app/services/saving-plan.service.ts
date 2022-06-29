import { Platform, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

// Constants
import { SQLITE } from '../constants';

// Enums
import { Interval } from '../enums';

// Models
import { SavingPlan } from '../models';

// Services
import { DatabaseService } from './database.service';

// Utils
import { roundDecimal } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class SavingPlanService {
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService,
    private toastController: ToastController
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
  getSavingPlanById = async (id: number): Promise<SavingPlan> => {
    let savingPlan: SavingPlan | any = null;

    if (this.platform.is('cordova')) {
      savingPlan = await this.getSavingPlanByIdFromDevice(id);
    } else {
      savingPlan = await this.getSavingPlanByIdFromBrowser(id);
    }

    return savingPlan;
  };

  /**
   * Gets a saving plan by Id from the device.
   * @param id The saving plan id.
   * @returns The saving plan.
   */
  private getSavingPlanByIdFromDevice = async (
    id: number
  ): Promise<SavingPlan> => {
    const resultQuery = await this.databaseService.storage.executeSql(
      this.SELECT_SAVING_PLAN_BY_ID,
      [id]
    );

    let savingPlan: SavingPlan = null;

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
  private getSavingPlanByIdFromBrowser = (id: number): Promise<SavingPlan> =>
    new Promise<SavingPlan>((resolve, reject) => {
      setTimeout(() => {
        let savingPlansAsString = localStorage.getItem(
          SQLITE.TABLE_SAVING_PLAN
        );

        let savingPlan: SavingPlan = null;

        if (savingPlansAsString !== null) {
          const savingPlans = JSON.parse(savingPlansAsString);

          savingPlan = savingPlans.find((p: SavingPlan) => p.id === id);
        }

        resolve(savingPlan);
      }, 1000);
    });

  /**
   * Gets all the saving plans.
   * @returns All the saving plans.
   */
  getAllSavingPlans = async (): Promise<SavingPlan[]> => {
    let plans: SavingPlan[] = [];

    if (this.platform.is('cordova')) {
      plans = await this.getAllSavingPlansFromDevice();
    } else {
      plans = await this.getAllSavingPlansFromBrowser();
    }

    return plans;
  };

  /**
   * Gets all the saving plans from the device.
   * @returns All the saving plans from the device.
   */
  private getAllSavingPlansFromDevice = async (): Promise<SavingPlan[]> => {
    const resultQuery = await this.databaseService.storage.executeSql(
      this.SELECT_ALL_SAVING_PLANs,
      []
    );

    let savingPlans: SavingPlan[] = [];

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
  private getAllSavingPlansFromBrowser = (): Promise<SavingPlan[]> =>
    new Promise<SavingPlan[]>((resolve, reject) => {
      setTimeout(() => {
        const savingPlansAsString = localStorage.getItem(
          SQLITE.TABLE_SAVING_PLAN
        );

        let savingPlans: SavingPlan[] = [];

        if (savingPlansAsString !== null) {
          savingPlans = JSON.parse(savingPlansAsString);
        }

        resolve(savingPlans);
      }, 1000);
    });

  /**
   * Creates a new saving plan.
   * @param savingPlan The saving plan.
   */
  createSavingPlan = async (savingPlan: SavingPlan): Promise<void> => {
    if (this.platform.is('cordova')) {
      await this.createSavingPlanOnDevice(savingPlan);
    } else {
      await this.createSavingPlanOnBrowser(savingPlan);
    }
  };

  /**
   * Creates a new saving plan on the device.
   * @param savingPlan The saving plan on the device.
   */
  private createSavingPlanOnDevice = async (
    savingPlan: SavingPlan
  ): Promise<void> => {
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
  private createSavingPlanOnBrowser = (savingPlan: SavingPlan): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        let plansAsString = localStorage.getItem(SQLITE.TABLE_SAVING_PLAN);
        let plans: SavingPlan[] = [];

        if (plansAsString !== null) {
          plans = JSON.parse(plansAsString);
        }

        const maxId = this.getMaxIdFromBrowser();

        savingPlan.id = maxId + 1;

        plans.push(savingPlan);

        plansAsString = JSON.stringify(plans);

        localStorage.setItem(SQLITE.TABLE_SAVING_PLAN, plansAsString);

        resolve();
      }, 1000);
    });

  /**
   * Updates a saving plan.
   * @param savingPlan The saving plan.
   */
  updateSavingPlan = async (savingPlan: SavingPlan): Promise<void> => {
    if (this.platform.is('cordova')) {
      await this.updateSavingPlanOnDevice(savingPlan);
    } else {
      await this.updateSavingPlanOnBrowser(savingPlan);
    }
  };

  /**
   * Updates a saving plan on the device.
   * @param savingPlan The saving plan on the device.
   */
  private updateSavingPlanOnDevice = async (
    savingPlan: SavingPlan
  ): Promise<void> => {
    const updateSQL = `UPDATE ${SQLITE.TABLE_SAVING_PLAN} SET
      income = ?,
      interval = ?,
      amount_to_save = ?,
      bills = ?,
      years = ?,
      goal = ?,
      fee = ?,
      status = ?,
      started_date = ?,
      completed_date = ?,
      discarded_date = ?
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
        savingPlan.started_date,
        savingPlan.completed_date,
        savingPlan.discarded_date,
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
  private updateSavingPlanOnBrowser = (savingPlan: SavingPlan): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        let plansAsString = localStorage.getItem(SQLITE.TABLE_SAVING_PLAN);
        let plans: SavingPlan[] = [];

        if (plansAsString !== null) {
          plans = JSON.parse(plansAsString);
        }

        plans = plans.map((p: SavingPlan) => {
          if (p.id === savingPlan.id) {
            p = { ...p, ...savingPlan };
          }

          return p;
        });

        plansAsString = JSON.stringify(plans);

        localStorage.setItem(SQLITE.TABLE_SAVING_PLAN, plansAsString);

        resolve();
      }, 1000);
    });

  /**
   * Deletes a saving plan.
   * @param savingPlan The saving plan.
   */
  deleteSavingPlan = async (savingPlan: SavingPlan): Promise<void> => {
    if (this.platform.is('cordova')) {
      await this.deleteSavingPlanFromDevice(savingPlan);
    } else {
      await this.deleteSavingPlanFromBrowser(savingPlan);
    }
  };

  /**
   * Deletes a saving plan from the device.
   * @param savingPlan The saving plan.
   */
  private deleteSavingPlanFromDevice = async (
    savingPlan: SavingPlan
  ): Promise<void> => {
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
  private deleteSavingPlanFromBrowser = (
    savingPlan: SavingPlan
  ): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        let plansAsString = localStorage.getItem(SQLITE.TABLE_SAVING_PLAN);
        let plans: SavingPlan[] = [];

        if (plansAsString !== null) {
          plans = JSON.parse(plansAsString);
        }

        plans = plans.filter((p: SavingPlan) => p.id !== savingPlan.id);

        plansAsString = JSON.stringify(plans);

        localStorage.setItem(SQLITE.TABLE_SAVING_PLAN, plansAsString);

        resolve();
      }, 1000);
    });

  /**
   * Gets the max id from saving plans saved on browser.
   * @returns The max Id.
   */
  private getMaxIdFromBrowser() {
    let maxId = 0;

    const plansAsString = localStorage.getItem(SQLITE.TABLE_SAVING_PLAN);

    if (plansAsString !== null) {
      const plans = JSON.parse(plansAsString);
      const ids = plans.map((d) => d.id);

      maxId = Math.max(...ids);
    }

    return maxId;
  }

  /**
   * Calculate the fee according the saving plan.
   * @param plan The saving plan.
   * @returns Fee
   */
  calculateFee = async (plan: SavingPlan | any) => {
    let { amount_to_save, income, interval, bills, years } = plan;

    let borrowingCapacity = income - bills;
    let dividend = 0;

    switch (interval) {
      case Interval.Weekly:
        dividend = 52.1429;
        borrowingCapacity /= 4.34524;
        break;
      case Interval.Biweekly:
        dividend = 26.0714;
        borrowingCapacity /= 2.17262;
        break;
      default:
        // Monthly
        dividend = 12;
        break;
    }

    dividend *= years;

    const fee = roundDecimal(amount_to_save / dividend, 2);

    if (fee > borrowingCapacity) {
      const toast = await this.toastController.create({
        message: `Imposible ahorrar ese monto en el plazo de años`,
        duration: 5000,
      });

      await toast.present();

      return Promise.reject();
    }

    return fee;
  };
}
