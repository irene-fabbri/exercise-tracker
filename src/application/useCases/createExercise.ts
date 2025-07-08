import { Exercise } from "../../domain/Exercise.js";
import { AccountId, GymBud } from "../../domain/Account.ts";
import { AccountNotFoundError } from "../applicationErrors.js";
import { ExerciseRepository } from "../repositories/exerciseRepository.js";
import { AccountRepository } from "../repositories/accountRepository.ts";

class CreateExerciseService {
  constructor(
    private exerciseRepository: ExerciseRepository,
    private accountRepository: AccountRepository
  ) {}

  async execute(
    descriptionAsString: string,
    durationAsNumber: number,
    dateAsString: string | null,
    userIdAsString: string
  ): Promise<Exercise> {
    // Verify the userId is correct
    const exerciseAccountId = AccountId.fromString(userIdAsString);
    // Verify an user with that id exists
    const gymbud = await this.accountRepository.findById(exerciseAccountId);
    if (!gymbud) {
      throw new AccountNotFoundError(exerciseAccountId.value);
    }
    const exercise = Exercise.create(
      descriptionAsString,
      durationAsNumber,
      gymbud as GymBud,
      dateAsString
    );

    await this.exerciseRepository.create(exercise);

    return exercise;
  }
}
export { CreateExerciseService };
