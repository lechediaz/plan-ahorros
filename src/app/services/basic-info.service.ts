import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Constants
import { SQLITE } from '../constants';

// Models
import { BasicInfo } from '../models';

// Services
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class BasicInfoService {
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService
  ) {}

  private _basicInfo = new BehaviorSubject<BasicInfo>(null);

  /** The user's basic information. */
  basicInfo = this._basicInfo.asObservable();

  /** SQL string to query the user's basic information record */
  private readonly SELECT_ALL_STRING = `SELECT username, income FROM ${SQLITE.TABLE_BASIC_INFO}`;

  /**
   * Loads the user's basic information.
   */
  loadBasicInfo = async () => {
    let basicInfo: BasicInfo | any = null;

    if (this.platform.is('cordova')) {
      basicInfo = await this.loadBasicInfoFromDevice();
    } else {
      basicInfo = this.loadBasicInfoFromBrowser();
    }

    if (basicInfo !== null) {
      this._basicInfo.next(basicInfo);
    }
  };

  /**
   * Loads the user's basic information from the device.
   * @returns The user's basic information.
   */
  private loadBasicInfoFromDevice = async () => {
    const resultQuery = await this.databaseService.storage.executeSql(
      this.SELECT_ALL_STRING,
      []
    );

    let basicInfo = null;

    if (resultQuery.rows.length > 0) {
      basicInfo = resultQuery.rows.item(0);
    }

    return basicInfo;
  };

  /**
   * Loads the user's basic information from the browser.
   * @returns The user's basic information.
   */
  private loadBasicInfoFromBrowser = () => {
    let basicInfo = localStorage.getItem(SQLITE.TABLE_BASIC_INFO);

    if (typeof basicInfo === 'string') {
      basicInfo = JSON.parse(basicInfo);
    }

    return basicInfo;
  };

  /**
   * Saves the user's basic information.
   * @param basicInfo The user's basic information.
   */
  saveBasicInfo = async (basicInfo: BasicInfo | any) => {
    if (basicInfo !== null) {
      if (this.platform.is('cordova')) {
        await this.saveBasicInfoAtDevice(basicInfo);
      } else {
        this.saveBasicInfoAtBrowser(basicInfo);
      }

      this._basicInfo.next(basicInfo);
    }
  };

  /**
   * Saves the user's basic information at device.
   * @param basicInfo The user's basic information.
   */
  private saveBasicInfoAtDevice = async (basicInfo: BasicInfo | any) => {
    const resultQuery = await this.databaseService.storage.executeSql(
      this.SELECT_ALL_STRING,
      []
    );

    if (resultQuery.rows.length === 0) {
      // Insert

      const resultInsert = await this.databaseService.storage.executeSql(
        `INSERT INTO ${SQLITE.TABLE_BASIC_INFO} (username, income) VALUES (?, ?)`,
        [basicInfo.username, basicInfo.income]
      );

      console.log(
        `${SQLITE.TABLE_BASIC_INFO}: ${resultInsert.rowsAffected} records inserted`
      );
    } else {
      // Update

      const resultUpdate = await this.databaseService.storage.executeSql(
        `UPDATE ${SQLITE.TABLE_BASIC_INFO} SET username = ?, income = ?`,
        [basicInfo.username, basicInfo.income]
      );

      console.log(
        `${SQLITE.TABLE_BASIC_INFO}: ${resultUpdate.rowsAffected} records updated`
      );
    }
  };

  /**
   * Saves the user's basic information at browser.
   * @param basicInfo The user's basic information.
   */
  saveBasicInfoAtBrowser = (basicInfo: BasicInfo | any) => {
    const basicInfoString = JSON.stringify(basicInfo);

    localStorage.setItem(SQLITE.TABLE_BASIC_INFO, basicInfoString);
  };
}
