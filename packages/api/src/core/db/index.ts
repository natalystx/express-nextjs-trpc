import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '@/schema/index';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export default class DatabaseConnection {
  private static instance: DatabaseConnection;
  private _db!: MySql2Database<typeof schema>;
  private constructor() {
    const connection = mysql.createConnection({
      host: process.env.DB_URL || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    const drizzleInstance = drizzle(connection, {
      schema,
      mode: 'default',
    });
    this._db = drizzleInstance;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      this.instance = new DatabaseConnection();
    }

    return DatabaseConnection.instance;
  }

  getDb() {
    return this._db;
  }
}
