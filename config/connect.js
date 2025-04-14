const sqlite3 = require('sqlite3').verbose();

const DB = new sqlite3.Database('./exercises.db', sqlite3.OPEN_READWRITE, connected);

    function connected(err){
        if(err) {
            const error = new Error('Database connection failed');
            error.status = 500;
            error.code = 'DB_CONNECTION_ERROR';
            error.title = 'Database Connection Error';
            error.detail = 'There was an issue connecting to the database.';
            return;
        }
        console.log('Connected to the DB');
    }

module.exports = DB;