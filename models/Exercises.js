const createError = require('../utils/createError');


class Exercise {
    constructor(description, duration, date = null){
        this.description = description;
        this.duration = duration;
        this.date = chackDate(date);
    }
    
    // TODO: logiche di validazione
    checkDate(date) {
        if (! date) {
            return new Date();
        }

        parsedDate = Date.parse(date)
        if (isNaN(parsedDate)) {
            throw createError('Invalid Date', 400, 'invalid-date');
        }
        return new Date(parsedDate);
    }
}

class Exercises {

    constructor(db){
        this.create = create(db)
        this.findByUser = findByUser(db);
    }
}
module.exports = Exercises;

// così ho la possibilità di passare un mock database e testare findByUser
const findByUser = (db) => (userId) =>  {

    const sql = `SELECT * FROM exercises WHERE user_id = ?`;
        return new Promise((resolve, reject) => {
            db.all(sql,[userId], (error,rows)=>{
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
                
                // passo un array di esercizi
                resolve(rows.map(row => new Exercise(row.description, row.duration, row.date)));
            });
        });
}

// TODO: exercise -> Exercise object
const create = (db) => (exercise, userId) => {
    const exercise = new Exercise(
        exercise.description, 
        exercise.duration, 
        exercise.date??null
    );
    
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO exercises(description, duration, date,user_id) VALUES (?, ?, ?, ?)`;
        db.run(sql, [exercise.description,exercise.duration,exercise.date.toDateString(), userId] , function(error) {
            if(error){
                return reject(createError(
                        'Error creating exercise',
                        468,
                        'exercise_creation_error',
                        'Exercise Creation Error',
                        error.message
                ));
            }
        });
    });
}
