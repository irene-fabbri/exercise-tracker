import sqlite3 from 'sqlite3';
import { DatabaseAccessError, DatabaseError } from './databaseErrors';

class DBManager {
    constructor() {
        this.database = null;
    }

    // Initialize the DB connection only once
    async initializeDatabase() {
        if (this.database) return this.database;    
        return new Promise((resolve, reject) => {
            this.database = new sqlite3.Database('./exercises.db', sqlite3.OPEN_READWRITE, (error) => {
                if (error) {
                    console.error('Database connection failed:', error);
                    return reject(new DatabaseAccessError('Database connection failed', { code: error.code, cause: error }));
                }
                console.log('Connected to the DB');
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
            this.database.close((error) => {
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