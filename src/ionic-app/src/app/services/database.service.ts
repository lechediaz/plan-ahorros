import { Injectable } from '@angular/core';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

const DB_FILE_NAME = 'data.db';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private sqlite: SQLite) {}

  createDataBase = async () => {
    const db = await this.sqlite.create({
      name: DB_FILE_NAME,
      location: 'default',
    });

    /* TODO:  Añadir los campos startedDate y completedDate,
              porque son todos raror en SQLite
    */

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS saving_plan (
        id INTEGER PRIMARY KEY,
        income INTEGER NOT NULL,
        interval INTEGER DEFAULT 0,
        amount_to_save INTEGER,
        bills INTEGER,
        years INTEGER,
        goal TEXT,
        fee INTEGER,
        status INTEGER
      ) WITHOUT ROWID;`,
      []
    );

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS basic_info (
        username TEXT PRIMARY KEY NOT NULL,
        income INTEGER NOT NULL DEFAULT 0
      ) WITHOUT ROWID;`,
      []
    );
  };
}
