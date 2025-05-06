import sqlite3 from 'sqlite3';
import { DatabaseAccessError, DatabaseError } from './databaseErrors';

class DBManager {
    constructor() {
        this.db = null;
    }

    // Initialize the DB connection only once
    async initDb() {
        if (this.db) return this.db;    
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database('./exercises.db', sqlite3.OPEN_READWRITE, (error) => {
                if (error) {
                    console.error('Database connection failed:', error);
                    return reject(new DatabaseAccessError('Database connection failed', { code: error.code, cause: error }));
                }
                console.log('Connected to the DB');
                resolve(this.db);
            });
        });
    }

    getDb() {
        return this.db;
    }
    
    async closeDb() {
        if (this.db) {
            this.db.close((error) => {
                if (error) {
                    console.error('Error closing database:', error);
                    throw new DatabaseError('Error closing the database', { code: error.code, cause: error });
                }

                console.log('Database connection closed');
            });
        };
    }
}

const dbManager = new DBManager();

export { dbManager };