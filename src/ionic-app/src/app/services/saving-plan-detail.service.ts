import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

// Enums
import { Interval, PlanStatus } from '../enums';

// Models
import { SavingPlan, SavingPlanDetail } from '../models';

// Services
import { DatabaseService } from './database.service';

// Utils
import { calculateNewDate, roundDecimal } from '../utils';
import { SQLITE } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class SavingPlanDetailService {
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService
  ) {}

  /**
   * Generates an array of SavingPlanDetail according the saving plan.
   * @param plan The saving plan.
   * @returns Array of SavingPlanDetail.
   */
  generateQuotas = (plan: SavingPlan): SavingPlanDetail[] => {
    const details: SavingPlanDetail[] = [];
    let multiple = 1;

    switch (plan.interval) {
      case Interval.Weekly:
        multiple = 52.1429;
        break;
      case Interval.Biweekly:
        multiple = 26.0714;
        break;
      default:
        // Monthly
        multiple = 12;
        break;
    }

    multiple *= plan.years;

    let newDate = new Date();
    let subTotal = 0;

    for (let year = 0; year < multiple; year++) {
      let fee = plan.fee;
      newDate = calculateNewDate(newDate, plan.interval);

      if (
        [Interval.Biweekly, Interval.Weekly].includes(plan.interval) &&
        year >= multiple - 1
      ) {
        fee = roundDecimal(plan.amount_to_save - subTotal, 2);
        subTotal = roundDecimal(subTotal + fee, 2);
      } else {
        subTotal = roundDecimal(subTotal + plan.fee, 2);
      }

      const newDetail: SavingPlanDetail = {
        fee,
        quota_number: year + 1,
        saving_date: newDate.toISOString(),
        saving_made: 0,
        saving_plan_id: plan.id,
        subtotal: subTotal,
      };

      details.push(newDetail);
    }

    return details;
  };

  /**
   * Allows to create saving plan details.
   * @param details The saving plan details to create.
   */
  createSavingPlanDetails = async (details: SavingPlanDetail[]) => {
    if (this.platform.is('cordova')) {
      await this.createSavingPlanDetailsDevice(details);
    } else {
      this.createSavingPlanDetailsOnBrowser(details);
    }
  };

  /**
   * Allows to create saving plan details on the browser.
   * @param detailsToCreate The saving plan details to create.
   */
  private createSavingPlanDetailsOnBrowser = (
    detailsToCreate: SavingPlanDetail[]
  ) => {
    let detailsAsString = localStorage.getItem(SQLITE.TABLE_SAVING_PLAN_DETAIL);

    let actualDetails: SavingPlanDetail[] = [];

    if (detailsAsString !== null) {
      actualDetails = JSON.parse(detailsAsString);
    }

    let maxId = this.getMaxIdFromBrowser();

    detailsToCreate = detailsToCreate.map((d) => ({ ...d, id: ++maxId }));

    actualDetails.push(...detailsToCreate);

    detailsAsString = JSON.stringify(actualDetails);

    localStorage.setItem(SQLITE.TABLE_SAVING_PLAN_DETAIL, detailsAsString);
  };

  /**
   * Allows to create saving plan details on the device.
   * @param details The saving plan details to create.
   */
  private createSavingPlanDetailsDevice = async (
    details: SavingPlanDetail[]
  ) => {
    const insertSQL = `INSERT INTO ${SQLITE.TABLE_SAVING_PLAN_DETAIL} (
      saving_plan_id,
      saving_date,
      subtotal,
      fee,
      quota_number,
      saving_made
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )`;

    for (let index = 0; index < details.length; index++) {
      const detail = details[index];

      const resultInsert = await this.databaseService.storage.executeSql(
        insertSQL,
        [
          detail.saving_plan_id,
          detail.saving_date,
          detail.subtotal,
          detail.fee,
          detail.quota_number,
          detail.saving_made,
        ]
      );

      console.log(
        `${SQLITE.TABLE_SAVING_PLAN_DETAIL}: ${resultInsert.rowsAffected} records inserted`
      );
    }
  };

  /**
   * Gets the max id from details saved on browser.
   * @returns The max Id.
   */
  private getMaxIdFromBrowser() {
    let maxId = 0;

    const detailsAsString = localStorage.getItem(
      SQLITE.TABLE_SAVING_PLAN_DETAIL
    );

    if (detailsAsString !== null) {
      const details = JSON.parse(detailsAsString);
      const ids = details.map((d) => d.id);

      maxId = Math.max(...ids);
    }

    return maxId;
  }

  /**
   * Gets the next saving plan details to complete.
   * @returns Next saving plan details.
   */
  getNextSavingDetails = async (): Promise<SavingPlanDetail[]> => {
    if (this.platform.is('cordova')) {
      return await this.getNextSavingDetailsFromDevice();
    } else {
      return this.getNextSavingDetailsFromBrowser();
    }
  };

  /**
   * Gets the next saving plan details to complete from device.
   * @returns All the saving plans from the device.
   */
  private getNextSavingDetailsFromDevice = async (): Promise<
    SavingPlanDetail[]
  > => {
    const resultQuery = await this.databaseService.storage.executeSql(
      `SELECT * FROM saving_plan_detail AS d0
      INNER JOIN (
        SELECT DISTINCT FIRST_VALUE(d.id) OVER (
          PARTITION BY d.saving_plan_id
          ORDER BY datetime(d.saving_date, 'localtime')
        ) AS id
        FROM saving_plan AS p
        INNER JOIN saving_plan_detail AS d ON p.id = d.saving_plan_id
        WHERE p.status = 1 AND d.saving_made = 0
      ) AS d1 ON d0.id = d1.id`,
      []
    );

    let savingPlanDetails: SavingPlanDetail[] = [];

    if (resultQuery.rows.length > 0) {
      for (let index = 0; index < resultQuery.rows.length; index++) {
        const savingPlanDetail = resultQuery.rows.item(index);

        savingPlanDetails.push(savingPlanDetail);
      }
    }

    return savingPlanDetails;
  };

  /**
   * Gets the next saving plan details to complete from browser.
   * @returns All the saving plans from the browser.
   */
  private getNextSavingDetailsFromBrowser = (): SavingPlanDetail[] => {
    const savingPlansAsString = localStorage.getItem(SQLITE.TABLE_SAVING_PLAN);
    let savingPlans: SavingPlan[] = [];

    if (savingPlansAsString !== null) {
      savingPlans = JSON.parse(savingPlansAsString);
    }

    // Here we have all the started saving plans.
    savingPlans = savingPlans.filter((p) => p.status === PlanStatus.Started);

    let nextSavingPlanDetails: SavingPlanDetail[] = [];

    const detailsAsString = localStorage.getItem(
      SQLITE.TABLE_SAVING_PLAN_DETAIL
    );

    if (detailsAsString !== null) {
      let details: SavingPlanDetail[] = JSON.parse(detailsAsString);

      // Filter the saving plan details where they are not saving_made, then sort them by saving_date.
      details = details
        .filter((d) => d.saving_made === 0)
        .sort(
          (a, b) =>
            new Date(a.saving_date).getTime() -
            new Date(b.saving_date).getTime()
        );

      // Get the first saving plan detail by saving plan.
      nextSavingPlanDetails = savingPlans.map((p) =>
        details.find((d) => d.saving_plan_id === p.id)
      );
    }

    return nextSavingPlanDetails;
  };
}
