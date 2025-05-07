import { dbManager } from "../database/dbManager.js";
import { User } from "../../domain/User.js";
import { UserRepository } from "../../application/repositories/userRepository.js";
import { DatabaseCreateError, DatabaseReadError } from "../database/databaseErrors.js";

class UserRepositorySQL extends UserRepository {
    constructor() {
        super();
    }

    async create(user) {
        const db = dbManager.getDb(); 
        const sql = `INSERT INTO users(userId, username) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {

            db.run(sql, [user.userId,user.username] , (error)=>{
                if(error){
                    console.error('Error creating user', error)
                    return reject(new DatabaseCreateError('Error creating user', { code: error.code, cause: error}));
                }

                resolve(user);
            });
        });
    }

    async getUserById(userId){
        const db = dbManager.getDb(); 
        const sql = `SELECT userId, username FROM users WHERE userId = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [userId], (error, row) => {
                if (error) {
                    console.error('Error retreiving user', error)
                    return reject(new DatabaseReadError('Error retreiving user', { code: error.code, cause: error}));
                }
    
                // If no row is returned, the user doesn't exist
                if (!row) {
                    console.error('User not found', error)
                    return reject(new DatabaseReadError('User not found', { code: error.code, cause: error}));
                }

                resolve(new User(row.username,row.userId));
            });
        });
    }

    async findAll(){
        const db = dbManager.getDb();
        const sql = `SELECT * FROM users`;

        return new Promise((resolve, reject) => {
            db.all(sql,[], (error,rows)=>{
                if(error){
                    console.error('Error retreiving users', error)
                    return reject(new DatabaseReadError('Error retrieving users', { code: error.code, cause: error}));
                };
                                
                resolve(rows.map(row => new User(row.username, row.userId)));
            });
        });
    }
}

export { UserRepositorySQL }