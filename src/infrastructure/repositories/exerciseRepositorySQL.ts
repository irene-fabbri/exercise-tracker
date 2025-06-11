import { dbManager } from "../database/dbManager.js";
import { Exercise } from "../../domain/Exercise.js";
import { ExerciseRepository } from "../../application/repositories/exerciseRepository.js";
import {
  DatabaseConnectionError,
  DatabaseCreateError,
  DatabaseReadError,
} from "../database/databaseErrors.js";
import { UserId } from "../../domain/UserId.js";
import { Description } from "../../domain/Description.js";
import { Duration } from "../../domain/Duration.js";
import { ExerciseDate } from "../../domain/ExerciseDate.js";

class ExerciseRepositorySQL implements ExerciseRepository {
  async create(exercise: Exercise, userId: UserId): Promise<void> {
    const db = dbManager.getDatabase();
    if (!db) {
      throw new DatabaseConnectionError();
    }

    const sql = `INSERT INTO exercises(description, duration, date,userId) VALUES (?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
      db.run(
        sql,
        [
          exercise.description.value,
          exercise.duration.value,
          exercise.date.value.toDateString(),
          userId.value,
        ],
        (error) => {
          if (error) {
            console.error("Error creating exercise", error);
            return reject(new DatabaseCreateError("Error creating exercise"));
          }

          resolve();
        }
      );
    });
  }

  async findByUserId(userId: UserId): Promise<Exercise[] | null> {
    const db = dbManager.getDatabase();
    if (!db) {
      throw new DatabaseConnectionError();
    }

    const sql = `SELECT * FROM exercises WHERE userId = ?`;

    return new Promise((resolve, reject) => {
      db.all(sql, [userId.value], (error, rows) => {
        if (error) {
          console.error("Error retreiving exercises", error);
          return reject(new DatabaseReadError("Error retreiving exercises"));
        }

        const typedRows = rows as {
          description: string;
          duration: number;
          date: string;
        }[];

        if (typedRows.length === 0) {
          return resolve(null);
        }

        const exercises = typedRows.map(
          (row) =>
            new Exercise(
              new Description(row.description),
              new Duration(row.duration),
              new ExerciseDate(row.date)
            )
        );

        resolve(exercises);
      });
    });
  }
}

export { ExerciseRepositorySQL };
