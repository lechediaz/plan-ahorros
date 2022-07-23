import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

// Enums
import { Interval, PlanStatus } from '../enums';

// Models
import { FeeCardInfo, SavingPlan, SavingPlanDetail } from '../models';

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
  createSavingPlanDetails = async (
    details: SavingPlanDetail[]
  ): Promise<void> => {
    if (this.platform.is('cordova')) {
      await this.createSavingPlanDetailsDevice(details);
    } else {
      await this.createSavingPlanDetailsOnBrowser(details);
    }
  };

  /**
   * Allows to create saving plan details on the browser.
   * @param detailsToCreate The saving plan details to create.
   */
  private createSavingPlanDetailsOnBrowser = (
    detailsToCreate: SavingPlanDetail[]
  ): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        let detailsAsString = localStorage.getItem(
          SQLITE.TABLE_SAVING_PLAN_DETAIL
        );

        let actualDetails: SavingPlanDetail[] = [];

        if (detailsAsString !== null) {
          actualDetails = JSON.parse(detailsAsString);
        }

        let maxId = this.getMaxIdFromBrowser();

        detailsToCreate = detailsToCreate.map((d) => ({ ...d, id: ++maxId }));

        actualDetails.push(...detailsToCreate);

        detailsAsString = JSON.stringify(actualDetails);

        localStorage.setItem(SQLITE.TABLE_SAVING_PLAN_DETAIL, detailsAsString);

        resolve();
      }, 800);
    });

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
    const details = this.getDetailsFromBrowser();

    if (details.length > 0) {
      const ids = details.map((d) => d.id);

      maxId = Math.max(...ids);
    }

    return maxId;
  }

  /**
   * Gets the pending details.
   * @returns The pending details.
   */
  getPendingDetails = async (): Promise<FeeCardInfo[]> => {
    if (this.platform.is('cordova')) {
      return await this.getPendingDetailsFromDevice();
    } else {
      return await this.getPendingDetailsFromBrowser();
    }
  };

  /**
   * Gets the pending details from device.
   * @returns The pending details from the device.
   */
  private getPendingDetailsFromDevice = async (): Promise<FeeCardInfo[]> => {
    const resultQuery = await this.databaseService.storage.executeSql(
      `SELECT d0.*, p.goal, p.amount_to_save FROM saving_plan_detail AS d0
      INNER JOIN (
        SELECT DISTINCT FIRST_VALUE(d.id) OVER (
          PARTITION BY d.saving_plan_id
          ORDER BY datetime(d.saving_date, 'localtime')
        ) AS id
        FROM saving_plan AS p
        INNER JOIN saving_plan_detail AS d ON p.id = d.saving_plan_id
        WHERE p.status = 1 AND d.saving_made = 0
      ) AS d1 ON d0.id = d1.id
      INNER JOIN saving_plan AS p ON d0.saving_plan_id = p.id`,
      []
    );

    let savingPlanDetails: FeeCardInfo[] = [];

    if (resultQuery.rows.length > 0) {
      for (let index = 0; index < resultQuery.rows.length; index++) {
        const savingPlanDetail = resultQuery.rows.item(index);

        savingPlanDetails.push(savingPlanDetail);
      }
    }

    return savingPlanDetails;
  };

  /**
   * Gets the pending details from browser.
   * @returns The pending details from the browser.
   */
  private getPendingDetailsFromBrowser = (): Promise<FeeCardInfo[]> =>
    new Promise<FeeCardInfo[]>((resolve, reject) => {
      setTimeout(() => {
        const savingPlansAsString = localStorage.getItem(
          SQLITE.TABLE_SAVING_PLAN
        );

        let savingPlans: SavingPlan[] = [];

        if (savingPlansAsString !== null) {
          savingPlans = JSON.parse(savingPlansAsString);
        }

        // Here we have all the started saving plans.
        savingPlans = savingPlans.filter(
          (p) => p.status === PlanStatus.Started
        );

        let nextSavingPlanDetails: FeeCardInfo[] = [];

        const detailsAsString = localStorage.getItem(
          SQLITE.TABLE_SAVING_PLAN_DETAIL
        );

        if (detailsAsString !== null) {
          let details: FeeCardInfo[] = JSON.parse(detailsAsString);

          // Filter the saving plan details where they are not saving_made, then sort them by saving_date.
          details = details
            .filter((d) => d.saving_made === 0)
            .sort(
              (a, b) =>
                new Date(a.saving_date).getTime() -
                new Date(b.saving_date).getTime()
            );

          // Get the first saving plan detail by saving plan.
          nextSavingPlanDetails = savingPlans.map((p) => {
            const detail = details.find((d) => d.saving_plan_id === p.id);

            // Add saving plan info.
            detail.amount_to_save = p.amount_to_save;
            detail.goal = p.goal;

            return detail;
          });
        }

        resolve(nextSavingPlanDetails);
      }, 800);
    });

  /**
   * Allows to mark a detail as made and if then there aren't pending details marcks the plan as completed.
   * @param detailId The detail Id.
   * @param planId The plan Id.
   * @returns Promise.
   */
  markDetailAsMade = async (
    detailId: number,
    planId: number
  ): Promise<void> => {
    if (this.platform.is('cordova')) {
      return await this.markDetailAsMadeOnDevice(detailId, planId);
    } else {
      return this.markDetailAsMadeOnBrowser(detailId, planId);
    }
  };

  /**
   * Allows to mark a detail as made and if then there aren't pending details marcks the plan as completed on the device.
   * @param detailId The detail Id.
   * @param planId The plan Id.
   * @returns Promise.
   */
  private markDetailAsMadeOnDevice = async (
    detailId: number,
    planId: number
  ): Promise<void> => {
    let resultUpdate = await this.databaseService.storage.executeSql(
      `UPDATE ${SQLITE.TABLE_SAVING_PLAN_DETAIL} SET saving_made = 1 WHERE id = ?`,
      [detailId]
    );

    console.log(
      `${SQLITE.TABLE_SAVING_PLAN_DETAIL}: ${resultUpdate.rowsAffected} records updated`
    );

    const resultQuery = await this.databaseService.storage.executeSql(
      `SELECT count(1) AS nextDetailsCount FROM ${SQLITE.TABLE_SAVING_PLAN_DETAIL}
      WHERE saving_made = 0 AND saving_plan_id = ?`,
      [planId]
    );

    let pendingDetails = 0;

    if (resultQuery.rows.length === 1) {
      pendingDetails = resultQuery.rows.item(0).nextDetailsCount;
    }

    // The saving plan completed.
    if (pendingDetails === 0) {
      const updateSQL = `UPDATE ${SQLITE.TABLE_SAVING_PLAN} SET status = ?, completed_date = ? WHERE id = ?`;

      resultUpdate = await this.databaseService.storage.executeSql(updateSQL, [
        PlanStatus.Completed,
        new Date().toISOString(),
        planId,
      ]);

      console.log(
        `${SQLITE.TABLE_SAVING_PLAN}: ${resultUpdate.rowsAffected} records updated`
      );
    }
  };

  /**
   * Allows to mark a detail as made and if then there aren't pending details marcks the plan as completed on the browser.
   * @param detailId The detail Id.
   * @param planId The plan Id.
   * @returns Promise.
   */
  private markDetailAsMadeOnBrowser = (detailId: number, planId: number) => {
    const details = this.getDetailsFromBrowser().map((d) => {
      if (d.id === detailId) {
        d.saving_made = 1;
      }

      return d;
    });

    const detailsAsString = JSON.stringify(details);

    localStorage.setItem(SQLITE.TABLE_SAVING_PLAN_DETAIL, detailsAsString);

    const pendingDetails = details.filter(
      (d) => d.saving_plan_id === planId && d.saving_made === 0
    ).length;

    if (pendingDetails === 0) {
      // The saving plan completed.

      let plansAsString = localStorage.getItem(SQLITE.TABLE_SAVING_PLAN);
      let plans: SavingPlan[] = JSON.parse(plansAsString);

      plans = plans.map((p) => {
        if (p.id === planId) {
          p.status = PlanStatus.Completed;
          p.completed_date = new Date().toISOString();
        }

        return p;
      });

      plansAsString = JSON.stringify(plans);

      localStorage.setItem(SQLITE.TABLE_SAVING_PLAN, plansAsString);
    }
  };

  /** Allows to get all the details from the browser. */
  private getDetailsFromBrowser(): SavingPlanDetail[] {
    const detailsAsString = localStorage.getItem(
      SQLITE.TABLE_SAVING_PLAN_DETAIL
    );

    let details: SavingPlanDetail[] = [];

    if (detailsAsString !== null) {
      details = JSON.parse(detailsAsString);
    }

    return details;
  }

  /**
   * Allows to get the details by plan Id.
   * @param planId The plan Id.
   * @returns The Plan Details.
   */
  getDetailsByPlanId = async (planId: number): Promise<SavingPlanDetail[]> => {
    if (this.platform.is('cordova')) {
      return await this.getDetailsByPlanIdFromDevice(planId);
    } else {
      return await this.getDetailsByPlanIdFromBrowser(planId);
    }
  };

  /**
   * Allows to get the details by plan Id from the device.
   * @param planId The plan Id.
   * @returns The Plan Details.
   */
  private getDetailsByPlanIdFromDevice = async (
    planId: number
  ): Promise<SavingPlanDetail[]> => {
    const resultQuery = await this.databaseService.storage.executeSql(
      `SELECT * FROM saving_plan_detail WHERE saving_plan_id = ?`,
      [planId]
    );

    let savingPlanDetails: FeeCardInfo[] = [];

    if (resultQuery.rows.length > 0) {
      for (let index = 0; index < resultQuery.rows.length; index++) {
        const savingPlanDetail = resultQuery.rows.item(index);

        savingPlanDetails.push(savingPlanDetail);
      }
    }

    return savingPlanDetails;
  };

  /**
   * Allows to get the details by plan Id from browser.
   * @param planId The plan Id.
   * @returns The Plan Details.
   */
  private getDetailsByPlanIdFromBrowser = async (
    planId: number
  ): Promise<SavingPlanDetail[]> =>
    new Promise<SavingPlanDetail[]>((resolve, reject) => {
      setTimeout(() => {
        const detailsAsString = localStorage.getItem(
          SQLITE.TABLE_SAVING_PLAN_DETAIL
        );

        let details: SavingPlanDetail[] = [];

        if (detailsAsString !== null) {
          details = JSON.parse(detailsAsString);
        }

        if (details.length > 0) {
          details = details.filter((d) => d.saving_plan_id === planId);
        }

        resolve(details);
      }, 800);
    });
}
