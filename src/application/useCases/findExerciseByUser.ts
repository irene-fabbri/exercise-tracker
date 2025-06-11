import { Exercise } from "../../domain/Exercise.js";
import { AccountId } from "../../domain/User.ts";
import { NoExercisesFoundError } from "../applicationErrors.js";
import { ExerciseRepository } from "../repositories/exerciseRepository.js";

class FindExerciseByUserIdService {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute(idAsString: string): Promise<Exercise[]> {
    const userId = AccountId.fromString(idAsString);

    const exerciseList = await this.exerciseRepository.findByUserId(userId);
    if (!exerciseList) {
      throw new NoExercisesFoundError();
    }
    return exerciseList;
  }
}

export { FindExerciseByUserIdService };
