const DB = require('./connect');
const Users = require('./Users');

class Exercises {

    constructor(DB){
      this.DB = DB;
    }
  
    static create(exerciseInfo, userId){
        const exercise = new Exercise(exerciseInfo.description, exerciseInfo.duration, exerciseInfo.date??'');
        return new Promise((resolve, reject) => {
            Users.getUserById(userId)
            .then((userObj) => {
                const sql = `INSERT INTO exercises(description, duration, date,user_id) VALUES (?, ?, ?, ?)`;
                DB.run(sql, [exercise.description,exercise.duration,exercise.date, userId] , function(err) {
                    if(err){
                        const error = new Error('Error creating exercise');
                        error.status = 468;
                        error.code = 'exercise_creation_error';
                        error.title = 'Exercise Creation Error';
                        error.detail = err.message;
                        return reject(error);
                    }

                    const data = {
                        'username': userObj.username,
                        'description': exercise.description,
                        'duration': exercise.duration,
                        'date': exercise.date,
                        '_id': userId
                    }
                    resolve(data);
                });
            }).catch((err) => {
                return reject(err);
            });
        });
    }
  
    static findByUser(userId){
        return Users.getUserById(userId)
        .then((userObj) => {
            const sql = `SELECT * FROM exercises WHERE user_id = ?`;

            return new Promise((resolve, reject) => {
                DB.all(sql,[userId], (err,rows)=>{
                    if(err){
                        const error = new Error('Error retrieving exercises');
                        error.status = 500;
                        error.code = 'USER_RETRIEVAL_ERROR';
                        error.title = 'User Retrieval Error';
                        error.detail = err.message;
                        return reject(error);
                    }

                    let data = {
                        'username':userObj.username,
                        'count':rows.length,
                        '_id': userId,
                        'log': []
                    };

                    rows.forEach(row => {
                        data.log.push({
                            'description': row.description,'duration':row.duration, 'date':row.date
                        });
                    });
                    resolve(data);
                });
            });
        }).catch((err) => {
            return Promise.reject(err);
        });
    }
}

class Exercise {
    constructor(description, duration, date = ''){
        this.description = description;
        this.duration = duration;
        // TODO: check for invalid date
        this.date = date ? new Date(date).toDateString() : new Date().toDateString();
    }
}

module.exports = Exercises;