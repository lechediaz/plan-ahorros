import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLITE } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  /** Database reference */
  storage: SQLiteObject;

  constructor(private sqlite: SQLite) {}

  /**
   * Prepares the database.
   */
  prepareDatabase = async () => {
    const db = await this.sqlite.create({
      name: SQLITE.DB_FILE_NAME,
      location: 'default',
    });

    this.storage = db;

    await this.createBasicInfoTable();
    await this.createSavingPlanTable();
    await this.createSavingPlanDetailTable();

    console.log('Database ready.');
  };

  /**
   * Creates the basic info table.
   * @returns Promise
   */
  private createBasicInfoTable = async () =>
    await this.storage.executeSql(
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
  private createSavingPlanTable = () => {
    // TODO Añadir los campos startedDate y completedDate, porque son todos raros en SQLite

    return this.storage.executeSql(
      `CREATE TABLE IF NOT EXISTS ${SQLITE.TABLE_SAVING_PLAN} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          income REAL NOT NULL,
          interval INTEGER NOT NULL DEFAULT 0,
          amount_to_save REAL NOT NULL,
          bills REAL NOT NULL,
          years INTEGER NOT NULL,
          goal TEXT NOT NULL,
          fee REAL NOT NULL,
          status INTEGER NOT NULL
        )`,
      []
    );
  };

  /**
   * Creates the saving plan detail table.
   * @returns Promise
   */
  private createSavingPlanDetailTable = () => {
    return this.storage.executeSql(
      `CREATE TABLE IF NOT EXISTS ${SQLITE.TABLE_SAVING_PLAN_DETAIL} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          saving_plan_id INTEGER NOT NULL,
          saving_date TEXT NOT NULL,
          subtotal REAL NOT NULL,
          fee REAL NOT NULL,
          quota_number INTEGER NOT NULL,
          saving_made INTEGER NOT NULL,
          FOREIGN KEY (saving_plan_id) REFERENCES ${SQLITE.TABLE_SAVING_PLAN}(id) ON DELETE CASCADE
        )`,
      []
    );
  };
}
