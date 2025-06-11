// Abstract Exercise Repository

import { Exercise } from "../../domain/Exercise.js";
import { AccountId } from "../../domain/User.js";

interface ExerciseRepository {
  create(exercise: Exercise, userId: AccountId): Promise<void>;
  findByUserId(userId: AccountId): Promise<Exercise[] | null>;
}

export { ExerciseRepository };
