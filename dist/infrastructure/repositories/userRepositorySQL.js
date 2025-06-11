import { dbManager } from "../database/dbManager.js";
import { User } from "../../domain/User.js";
import { DatabaseConnectionError, DatabaseCreateError, DatabaseReadError, } from "../database/databaseErrors.js";
import { UserId } from "../../domain/UserId.js";
import { Username } from "../../domain/Username.js";
class UserRepositorySQL {
    async create(user) {
        const db = dbManager.getDatabase();
        if (!db) {
            throw new DatabaseConnectionError();
        }
        const sql = `INSERT INTO users(userId, username) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(sql, [user.id.value, user.username.value], (error) => {
                if (error) {
                    console.error("Error creating user", error);
                    return reject(new DatabaseCreateError("Error creating user"));
                }
                resolve();
            });
        });
    }
    async findById(userId) {
        const db = dbManager.getDatabase();
        if (!db) {
            throw new DatabaseConnectionError();
        }
        const sql = `SELECT userId, username FROM users WHERE userId = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [userId.value], (error, row) => {
                if (error) {
                    console.error("Error retreiving user by ID", error);
                    return reject(new DatabaseReadError("Error retreiving user"));
                }
                // If no row is returned, the user doesn't exist
                if (!row) {
                    return resolve(null);
                }
                const user = new User(new UserId(row.userId), new Username(row.username));
                resolve(user);
            });
        });
    }
    async findByUsername(username) {
        const db = dbManager.getDatabase();
        if (!db) {
            throw new DatabaseConnectionError();
        }
        const sql = `SELECT userId, username FROM users WHERE username = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [username.value], (error, row) => {
                if (error) {
                    console.error("Error retreiving user by ID", error);
                    return reject(new DatabaseReadError("Error retreiving user"));
                }
                // If no row is returned, the user doesn't exist
                if (!row) {
                    return resolve(null);
                }
                const user = new User(new UserId(row.userId), new Username(row.username));
                resolve(user);
            });
        });
    }
    async findAll() {
        const db = dbManager.getDatabase();
        if (!db) {
            throw new DatabaseConnectionError();
        }
        const sql = `SELECT userId, username FROM users`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (error, rows) => {
                if (error) {
                    console.error("Error retreiving users", error);
                    return reject(new DatabaseReadError("Error retrieving users"));
                }
                const typedRows = rows;
                if (typedRows.length === 0) {
                    return resolve(null);
                }
                const users = typedRows.map((row) => new User(new UserId(row.userId), new Username(row.username)));
                resolve(users);
            });
        });
    }
}
export { UserRepositorySQL };
