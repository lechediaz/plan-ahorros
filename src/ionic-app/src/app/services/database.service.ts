import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

import { SQLITE } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  /** Database reference */
  storage: SQLiteObject;

  constructor(private appVersion: AppVersion, private sqlite: SQLite) {}

  /**
   * Prepares the database.
   */
  prepareDatabase = async () => {
    const db = await this.sqlite.create({
      name: SQLITE.DB_FILE_NAME,
      location: 'default',
    });

    this.storage = db;

    await this.createAppInfoTable();
    await this.createBasicInfoTable();
    await this.createSavingPlanTable();
    await this.createSavingPlanDetailTable();
    await this.updateDatabase();

    console.log('Database ready.');
  };

  /**
   * Creates the app info table.
   * @returns Promise
   */
  private createAppInfoTable = async () => {
    await this.storage.executeSql(
      `CREATE TABLE IF NOT EXISTS ${SQLITE.TABLE_APP_INFO} (
          version_code INTEGER NOT NULL DEFAULT 0
      )`,
      []
    );

    const resultQuery = await this.storage.executeSql(
      `SELECT COUNT(1) rowCount FROM ${SQLITE.TABLE_APP_INFO}`,
      []
    );

    let rowCount = 0;

    if (resultQuery.rows.length > 0) {
      rowCount = resultQuery.rows.item(0).rowCount;
    }

    if (rowCount === 0) {
      this.storage.executeSql(
        `INSERT INTO ${SQLITE.TABLE_APP_INFO} (version_code) VALUES (0)`,
        []
      );
    }
  };

  /**
   * Creates the basic info table.
   * @returns Promise
   */
  private createBasicInfoTable = () =>
    this.storage.executeSql(
      `CREATE TABLE IF NOT EXISTS ${SQLITE.TABLE_BASIC_INFO} (
        username TEXT NOT NULL,
        income REAL NOT NULL DEFAULT 0
      );`,
      []
    );

  /**
   * Creates the saving plantable.
   * @returns Promise
   */
  private createSavingPlanTable = () =>
    this.storage.executeSql(
      `CREATE TABLE IF NOT EXISTS ${SQLITE.TABLE_SAVING_PLAN} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          income REAL NOT NULL,
          interval INTEGER NOT NULL DEFAULT 0,
          amount_to_save REAL NOT NULL,
          bills REAL NOT NULL,
          years INTEGER NOT NULL,
          goal TEXT NOT NULL,
          fee REAL NOT NULL,
          status INTEGER NOT NULL,
          started_date TEXT,
          completed_date TEXT,
          discarded_date TEXT
        )`,
      []
    );

  /**
   * Creates the saving plan detail table.
   * @returns Promise
   */
  private createSavingPlanDetailTable = () =>
    // TODO Al parecer al eliminar un plan no elimina sus detalle, investigar por qué.
    this.storage.executeSql(
      `CREATE TABLE IF NOT EXISTS ${SQLITE.TABLE_SAVING_PLAN_DETAIL} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          saving_plan_id INTEGER NOT NULL,
          saving_date TEXT NOT NULL,
          subtotal REAL NOT NULL,
          fee REAL NOT NULL,
          quota_number INTEGER NOT NULL,
          saving_made INTEGER NOT NULL,
          FOREIGN KEY (saving_plan_id) REFERENCES ${SQLITE.TABLE_SAVING_PLAN} (id) ON DELETE CASCADE
        )`,
      []
    );

  /**
   * Gets the app version from the SQLite database.
   * @returns The app version from the SQLite database.
   */
  private getAppVersionFromDb = async () => {
    const resultQuery = await this.storage.executeSql(
      `SELECT version_code FROM ${SQLITE.TABLE_APP_INFO}`,
      []
    );

    let appVersion = 0;

    if (resultQuery.rows.length > 0) {
      appVersion = resultQuery.rows.item(0).version_code;
    }

    return appVersion;
  };

  /**
   * Updates the database according the oldest versions.
   */
  private updateDatabase = async () => {
    const appVersionDb = await this.getAppVersionFromDb();
    const appVersionCode = await this.appVersion.getVersionCode();

    if (appVersionDb !== appVersionCode) {
      for (let index = appVersionDb; index <= appVersionCode; index++) {
        const functionName = `updateDatabaseVersion${index}`;

        if (this[functionName] !== undefined) {
          await this[`updateDatabaseVersion${appVersionCode}`]();
        }
      }
    }
  };

  /**
   * Updates the database to the version 5.
   */
  private updateDatabaseVersion5 = async () => {
    const sql = `ALTER TABLE ${SQLITE.TABLE_SAVING_PLAN} ADD discarded_date TEXT`;

    await this.storage.sqlBatch([sql]);
  };
}
