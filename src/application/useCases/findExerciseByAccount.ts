import { Exercise } from "../../domain/Exercise.ts";
import { AccountId, GymBud } from "../../domain/Account.ts";
import {
  NoExercisesFoundError,
  AccountNotFoundError,
} from "../applicationErrors.ts";
import { ExerciseRepository } from "../repositories/exerciseRepository.ts";
import { AccountRepository } from "../repositories/accountRepository.ts";

class FindExerciseByAccountIdService {
  constructor(
    private exerciseRepository: ExerciseRepository,
    private accountRepository: AccountRepository
  ) {}

  async execute(idAsString: string): Promise<Exercise[]> {
    // Verify the accountId is correct
    const accountId = AccountId.fromString(idAsString);
    // Verify an user with that id exists
    const gymbud = (await this.accountRepository.findById(accountId)) as GymBud;
    if (!gymbud) {
      throw new AccountNotFoundError(accountId.value);
    }

    const exerciseList = await this.exerciseRepository.findByAccount(gymbud);
    if (!exerciseList) {
      throw new NoExercisesFoundError();
    }
    return exerciseList;
  }
}

export { FindExerciseByAccountIdService };
