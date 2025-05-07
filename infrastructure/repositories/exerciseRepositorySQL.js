import { dbManager } from "../database/dbManager.js";
import { Exercise } from "../../domain/Exercise.js";
import { ExerciseRepository } from "../../application/repositories/exerciseRepository.js";
import { DatabaseCreateError, DatabaseReadError } from "../database/databaseErrors.js";

class ExerciseRepositorySQL extends ExerciseRepository {
    constructor() {
        super();
    }

    async create(exercise, userId) {
        const db = await dbManager.getDb(); 
        const sql = `INSERT INTO exercises(description, duration, date,userId) VALUES (?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {

            db.run(sql, [exercise.description, exercise.duration, exercise.date.toDateString(), userId] , (error)=>{
                if(error){
                    console.error('Error creating exercise', error)
                    return reject(new DatabaseCreateError('Error creating exercise', { code: error.code, cause: error}));
                }

                resolve(exercise);
            });
        });
    }

    async findByUserId(userId) {
        const db = await dbManager.getDb();
        const sql = `SELECT * FROM exercises WHERE userId = ?`;
        return new Promise((resolve, reject) => {
            db.all(sql, [userId], (error, rows) => {
                if (error) {
                    console.error('Error retreiving exercises', error)
                    return reject(new DatabaseReadError('Error retreiving exercises', { code: error.code, cause: error}));
                }
    
                // If no row is returned, the user doesn't exist
                if (!row) {
                    console.error('User not found', error)
                    return reject(new DatabaseReadError('User not found', { code: error.code, cause: error}));
                }

                resolve ( rows.map( row => new Exercise(row.description, row.duration, row.date) ) );
            });
        });
    }
}

export { ExerciseRepositorySQL }