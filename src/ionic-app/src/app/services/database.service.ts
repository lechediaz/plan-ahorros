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
        income INTEGER NOT NULL DEFAULT 0
      );`,
      []
    );

  /**
   * Creates the basic info table.
   * @returns Promise
   */
  private createSavingPlanTable = () => {
    // TODO Añadir los campos startedDate y completedDate, porque son todos raros en SQLite

    return this.storage.executeSql(
      `CREATE TABLE IF NOT EXISTS ${SQLITE.TABLE_SAVING_PLAN} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          income INTEGER NOT NULL,
          interval INTEGER DEFAULT 0,
          amount_to_save INTEGER,
          bills INTEGER,
          years INTEGER,
          goal TEXT,
          fee INTEGER,
          status INTEGER
        )`,
      []
    );
  };
}
