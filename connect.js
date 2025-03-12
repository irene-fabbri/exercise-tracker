const sqlite3 = require('sqlite3').verbose();

const DB = new sqlite3.Database('./exercises.db', sqlite3.OPEN_READWRITE, connected);

function connected(err){
    if(err) {
        return res.status(500).send({
            "errors": [
                {
                    "status": "500",
                    "code": "db-creation-error",          
                    "title": "DB creation error",
                    "detail": "There have been issues in creating or in accessing the database"
                }
             ]
        });
    }
    console.log('DB created or already existing')
};

let sql = `CREATE TABLE IF NOT EXISTS users(
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL
)`;
DB.run(sql,[],(err) => {
    if(err) {
        return res.status(500).send({
            "errors": [
                {
                    "status": "500",
                    "code": "table-creation-error",          
                    "title": "table creation error",
                    "detail": "There have been issues in creating the users table"
                }
             ]
        });
    }
    console.log('users table created')
});

sql = `CREATE TABLE IF NOT EXISTS exercises(
    id INTEGER PRIMARY KEY,
    duration INTEGER NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(user) REFERENCES users(user_id)
)`;
DB.run(sql,[],(err) => {
    if(err) {
        return res.status(500).send({
            "errors": [
                {
                    "status": "500",
                    "code": "table-creation-error",          
                    "title": "table creation error",
                    "detail": "There have been issues in creating the exercises table"
                }
             ]
        });
    }
    console.log('exercises table created')
});

module.exports = DB;