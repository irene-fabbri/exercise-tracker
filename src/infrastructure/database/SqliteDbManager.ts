import sqlite3 from "sqlite3";
sqlite3.verbose();
import {
  DatabaseAccessError,
  DatabaseConfigError,
  DatabaseError,
  DatabaseInitializationError,
} from "./databaseErrors.ts";

import { DBManagerRepository } from "../../application/repositories/dbManagerRepository.ts";
import { SqliteConfig } from "../../config/config.ts";

class SqliteDbManager implements DBManagerRepository<sqlite3.Database> {
  private database: sqlite3.Database | null = null;
  constructor(private config: SqliteConfig) {}

  // Initialize the DB connection only once
  async initializeDatabase(): Promise<sqlite3.Database> {
    if (this.config.type !== "sqlite") {
      throw new DatabaseConfigError();
    }

    const dbPath = this.config.path;

    if (this.database) return this.database;

    return new Promise<sqlite3.Database>((resolve, reject) => {
      this.database = new sqlite3.Database(
        dbPath,
        sqlite3.OPEN_READWRITE,
        (error: Error | null) => {
          if (error) {
            console.error("Database connection failed:", error);
            return reject(
              new DatabaseAccessError("Database connection failed")
            );
          }

          if (!this.database) return reject(new DatabaseInitializationError());

          console.log("Connected to the Sqlite DB");
          resolve(this.database);
        }
      );
    });
  }

  // get the connection
  getDatabase(): sqlite3.Database | null {
    return this.database;
  }

  async closeDatabase(): Promise<void> {
    if (this.database) {
      return new Promise<void>((resolve, reject) => {
        this.database!.close((error) => {
          if (error) {
            console.error("Error closing database:", error);
            return reject(new DatabaseError("Error closing the database"));
          }
          this.database = null;
          console.log("Database connection closed");
          resolve();
        });
      });
    }
    console.log("Database connection is closed already");
  }
}

export { SqliteDbManager };
