const DB = require('../config/connect');
const Users = require('./Users');
const createError = require('../utils/createError');


class Exercise {
    constructor(description, duration, date = null){
        const exerciseDate = date ? new Date(date) : new Date();
        this.description = description;
        this.duration = duration;
        this.date = this.date = exerciseDate.toDateString();
    }
}

class Exercises {

    constructor(DB){
      this.DB = DB;
    }
  
    static create(exerciseInfo, userId){
        const exercise = new Exercise(
            exerciseInfo.description, 
            exerciseInfo.duration, 
            exerciseInfo.date??null
        );
        
        return new Promise((resolve, reject) => {
            Users.getUserById(userId)
            .then((userObj) => {
                const sql = `INSERT INTO exercises(description, duration, date,user_id) VALUES (?, ?, ?, ?)`;
                DB.run(sql, [exercise.description,exercise.duration,exercise.date, userId] , function(error) {
                    if(error){
                        return reject(createError(
                                'Error creating exercise',
                                468,
                                'exercise_creation_error',
                                'Exercise Creation Error',
                                error.message
                        ));
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
            }).catch(error => reject(error));
        });
    }
  
    static findByUser(userId){
        return Users.getUserById(userId)
        .then((userObj) => {
            const sql = `SELECT * FROM exercises WHERE user_id = ?`;

            return new Promise((resolve, reject) => {
                DB.all(sql,[userId], (error,rows)=>{
                    if(error) {
                        return reject(createError(
                            'Error retrieving exercises',
                                500,
                            'exercise_retrieval_error',
                            'Exercise Retrieval Error',
                            500,
                            error.message
                        ));
                    }

                    const data = {
                        'username':userObj.username,
                        'count':rows.length,
                        '_id': userId,
                        'log': rows.map(row => ({
                            description: row.description,
                            duration: row.duration,
                            date: row.date
                        }))
                    };

                    resolve(data);
                });
            });
        }).catch((error) => Promise.reject(error));
    }
}
module.exports = Exercises;