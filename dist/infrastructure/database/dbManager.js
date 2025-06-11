import sqlite3 from "sqlite3";
sqlite3.verbose();
import { DatabaseAccessError, DatabaseError, DatabaseInitializationError, } from "./databaseErrors.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, "exercises.db");
class DBManager {
    database = null;
    // Initialize the DB connection only once
    async initializeDatabase() {
        if (this.database)
            return this.database;
        return new Promise((resolve, reject) => {
            this.database = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error) => {
                if (error) {
                    console.error("Database connection failed:", error);
                    return reject(new DatabaseAccessError("Database connection failed"));
                }
                if (!this.database)
                    return reject(new DatabaseInitializationError());
                console.log("Connected to the DB");
                resolve(this.database);
            });
        });
    }
    // get the connection
    getDatabase() {
        return this.database;
    }
    async closeDatabase() {
        if (this.database) {
            return new Promise((resolve, reject) => {
                this.database.close((error) => {
                    if (error) {
                        console.error("Error closing database:", error);
                        return reject(new DatabaseError("Error closing the database"));
                    }
                    console.log("Database connection closed");
                    resolve();
                });
            });
        }
    }
}
const dbManager = new DBManager();
export { dbManager };
