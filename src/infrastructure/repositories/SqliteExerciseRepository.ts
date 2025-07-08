import { Exercise, ExerciseId } from "../../domain/Exercise.ts";
import { ExerciseRepository } from "../../application/repositories/exerciseRepository.ts";
import { DatabaseReadError } from "../database/databaseErrors.ts";
import { Description } from "../../domain/Description.ts";
import { Duration } from "../../domain/Duration.ts";
import { ExerciseDate } from "../../domain/ExerciseDate.ts";
import { GymBud } from "../../domain/Account.ts";
import { SqliteEntityRepository } from "./SqliteEntityRepository.ts";

export class SqliteExerciseRepository
  extends SqliteEntityRepository<Exercise>
  implements ExerciseRepository
{
  protected allowedColumns(): string[] {
    return ["id", "description", "duration", "date", "userId"];
  }
  protected getTableName(): string {
    return "exercises";
  }
  protected mapFromEntity(exercise: Exercise): Record<string, unknown> {
    return {
      id: exercise.id.value,
      description: exercise.description.value,
      duration: exercise.duration.value,
      date: exercise.date.value.toISOString(),
      userId: exercise.gymbud.id.value,
    };
  }
  private isExerciseRow(row: Record<string, unknown>): row is {
    id: string;
    description: string;
    duration: number;
    date: string;
    userId: string;
  } {
    return (
      typeof row.id === "string" &&
      typeof row.description === "string" &&
      typeof row.duration === "number" &&
      typeof row.date === "string"
    );
  }

  protected mapToEntity(
    row: Record<string, unknown>,
    context?: Partial<Exercise> | undefined
  ): Exercise {
    const user = context?.gymbud;
    if (!user) {
      throw new DatabaseReadError(
        `Invalid fields in context for document ${row.id} : ${JSON.stringify(
          context
        )}`
      );
    }

    if (this.isExerciseRow(row)) {
      try {
        const exercise = new Exercise(
          ExerciseId.fromString(row.id.toString()),
          new Description(row.description),
          new Duration(row.duration),
          user,
          ExerciseDate.fromString(row.date)
        );
        return exercise;
      } catch (error) {
        throw new DatabaseReadError(
          `Error parsing the object with id: ${
            row.id
          } to an exercise object. Object to parse: ${JSON.stringify(
            row
          )},${JSON.stringify(context)} `
        );
      }
    }
    throw new DatabaseReadError(
      `Invalid fields in document ${JSON.stringify(row)},${JSON.stringify(
        context
      )}`
    );
  }

  async create(exercise: Exercise): Promise<void> {
    return await this.store(exercise);
  }

  async findByAccount(user: GymBud): Promise<Exercise[] | null> {
    return await this.findByProperty("userId", user.id.value, { gymbud: user });
  }
}
