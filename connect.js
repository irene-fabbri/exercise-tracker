const sqlite3 = require('sqlite3').verbose();

function setupDB(next) {
    const DB = new sqlite3.Database('./exercises.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, connected);

    function connected(err){
        if(err) {
            const error = new Error('Database connection failed');
            error.status = 500;
            error.code = 'DB_CONNECTION_ERROR';
            error.title = 'Database Connection Error';
            error.detail = 'There was an issue connecting to the database.';
            return next(error);
        }
        console.log('DB created or already existing');
    }
    
    let sql = `CREATE TABLE IF NOT EXISTS users(
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL
    )`;
    DB.run(sql,[],(res,err) => {
        if(err) {
            const error = new Error('Table creation failed');
            error.status = 500;
            error.code = 'table_creation_error';
            error.title = 'Table Creatiom Error';
            error.detail = 'There was an issue creating the users table';
            return next(error);
        }
        console.log('users table created')
    });
    
    sql = `CREATE TABLE IF NOT EXISTS exercises(
        id INTEGER PRIMARY KEY,
        duration INTEGER NOT NULL,
        date TEXT NOT NULL,
        user TEXT,
        FOREIGN KEY(user) REFERENCES users(user_id)
    )`;
    DB.run(sql,[],(err) => {
        if(err) {
            const error = new Error('Table creation failed');
            error.status = 500;
            error.code = 'table_creation_error';
            error.title = 'Table Creatiom Error';
            error.detail = 'There was an issue creating the exercises table';
            return next(error);
        }
        console.log('exercises table created')
    });
    return DB;
};

module.exports = setupDB;