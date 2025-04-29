import { DB } from '../config/connect.js';
import md5 from 'js-md5';
import { createError } from '../utils/createError.js';


class Users {

    constructor(DB){
      this.DB = DB;
    }
  
    static create(username){
        
        const sql = `INSERT INTO users(id, username) VALUES (?, ?)`;
        const id = md5(`${username}${new Date().toString()}`);
        return new Promise((resolve, reject) => {

            DB.run(sql, [id,username] , (error)=>{
                if(error){
                    return reject(createError(
                        'Error creating user',
                        467,
                        'user_creation_error',
                        'User Creation Error',
                        error.message
                    ));
                }

                const data = {
                    'username': username, 
                    '_id':id
                }
                resolve(data);   
            });
        });
    }
  
    static getUserById(userId){
        const sql = `SELECT id, username FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            DB.get(sql, [userId], (error, row) => {
                if (error) {
                    return reject(createError(
                        'Error checking user',
                        468,
                        'user_check_error',
                        'User Check Error',
                        error.message
                    ));
                }
    
                // If no row is returned, the user doesn't exist
                if (!row) {
                    return reject(createError(
                        'User not found',
                        404,
                        'user_not_found',
                        'User Not Found',
                        'The provided user_id does not exist in the users table'
                    ));
                }

                const data = {
                    'username': row.username, 
                    'id':row.id
                }
                resolve(data);
            });
        });
    }

    static findAll(){
        const sql = `SELECT * FROM users`;
        return new Promise((resolve, reject) => {
            DB.all(sql,[], (error,rows)=>{
                if(error){
                    return reject(createError(
                        'Error retrieving users',
                        500,
                        'USER_RETRIEVAL_ERROR',
                        'User Retrieval Error',
                        error.message
                    ));
                }

                const data = {
                    users: rows.map(row => ({
                        username: row.username,
                        _id: row.id
                    }))
                };
                                
                resolve(data);
            });
        });
    }
}

export { Users };