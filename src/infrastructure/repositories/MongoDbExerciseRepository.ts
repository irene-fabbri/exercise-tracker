import { Exercise, ExerciseId } from "../../domain/Exercise.ts";
import { ExerciseRepository } from "../../application/repositories/exerciseRepository.ts";
import { GymBud } from "../../domain/Account.ts";
import { Collection, Document, WithId } from "mongodb";
import { MongoDbEntityRepository } from "./MongoDBEntityRepository.ts";
import { Description } from "../../domain/Description.ts";
import { Duration } from "../../domain/Duration.ts";
import { ExerciseDate } from "../../domain/ExerciseDate.ts";
import { DatabaseReadError } from "../database/databaseErrors.ts";

class MongoDbExerciseRepository
  extends MongoDbEntityRepository<Exercise>
  implements ExerciseRepository
{
  protected allowedColumns(): string[] {
    return ["_id", "description", "duration", "date", "userId"];
  }

  protected getCollection(): Collection {
    return this.db.collection("exercises");
  }

  protected mapToEntity(
    document: WithId<Document>,
    context: Partial<Exercise>
  ): Exercise {
    const user = context?.gymbud;

    if (!user) {
      throw new DatabaseReadError(
        `Invalid fields in context for document ${
          document._id
        } : ${JSON.stringify(context)}`
      );
    }
    if (
      "description" in document &&
      typeof document.description === "string" &&
      "date" in document &&
      document.date instanceof Date &&
      "duration" in document &&
      typeof document?.duration === "number"
    ) {
      try {
        const exercise = new Exercise(
          ExerciseId.fromString(document._id.toHexString()),
          new Description(document.description),
          new Duration(document.duration),
          user,
          ExerciseDate.fromString(document.date.toISOString())
        );
        return exercise;
      } catch (error) {
        throw new DatabaseReadError(
          `Invalid fields in document ${JSON.stringify(document)}`
        );
      }
    }
    throw new DatabaseReadError(
      `The object with id: ${document._id} has no or wrongly formatted description, duration or date`
    );
  }

  protected mapFromEntity(exercise: Exercise): Document {
    return {
      description: exercise.description.value,
      duration: exercise.duration.value,
      date: exercise.date.value,
      userId: MongoDbEntityRepository.convertUuidToBinary(
        exercise.gymbud.id.value
      ),
    };
  }

  async create(exercise: Exercise): Promise<void> {
    return await this.store(exercise);
  }

  async findByAccount(user: GymBud): Promise<Exercise[] | null> {
    const userId = MongoDbEntityRepository.convertUuidToBinary(user.id.value);

    const result = await this.findByProperty("userId", userId, {
      gymbud: user,
    });
    return result;
  }
}

export { MongoDbExerciseRepository };
