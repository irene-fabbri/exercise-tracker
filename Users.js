const DB = require('./connect');
const md5 = require('js-md5');

class Users {

    constructor(DB){
      this.DB = DB;
    }
  
    static create(username){
        const sql = `INSERT INTO users(id, username) VALUES (?, ?)`;
        const id = md5(`${username}${new Date().toString}`);
        return new Promise((resolve, reject) => {

            DB.run(sql, [id,username] , (err)=>{
                if(err){
                    const error = new Error('Error creating user');
                    error.status = 467;
                    error.code = 'user_creation_error';
                    error.title = 'User Creation Error';
                    error.detail = err.message;
                    return reject(error);
                }

                const data = {'username': username, '_id':id}
                resolve(data);    
            });
        });
    }
  
    static getUserById(userId){
        const sql = `SELECT id, username FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            DB.get(sql, [userId], (err, row) => {
                if (err) {
                    const error = new Error('Error checking user');
                    error.status = 468;
                    error.code = 'user_check_error';
                    error.title = 'User Check Error';
                    error.detail = err.message;
                    return reject(error);
                }
    
                // If no row is returned, the user doesn't exist
                if (!row) {
                    const error = new Error('User not found');
                    error.status = 404;
                    error.code = 'user_not_found';
                    error.title = 'User Not Found';
                    error.detail = 'The provided user_id does not exist in the users table';
                    return reject(error);
                }
                const data = {'username': row.username, 'id':row.id}
                resolve(data);
            });
        });
    }

    static findAll(){
        const sql = `SELECT * FROM users`;
        return new Promise((resolve, reject) => {
            DB.all(sql,[], (err,rows)=>{
                if(err){
                    const error = new Error('Error retrieving users');
                    error.status = 500;
                    error.code = 'USER_RETRIEVAL_ERROR';
                    error.title = 'User Retrieval Error';
                    error.detail = 'There was an issue retrieving users from the database.';
                    return reject(error);
                }

                let data = {users:[]};
                rows.forEach(row => {
                    data.users.push({'username': row.username,'_id':row.id});
                });
                resolve(data);
            });
        });
    }
}

module.exports = Users;