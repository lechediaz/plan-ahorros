import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

// Enums
import { Interval } from '../enums';

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
   * @param details The saving plan details to create.
   */
  private createSavingPlanDetailsOnBrowser = (details: SavingPlanDetail[]) => {
    let maxId = this.getMaxIdFromBrowser();

    details = details.map((d) => ({ ...d, id: ++maxId }));

    const detailsAsString = JSON.stringify(details);

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
}
