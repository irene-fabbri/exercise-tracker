import { Description } from "../../domain/Description.js";
import { Duration } from "../../domain/Duration.js";
import { Exercise } from "../../domain/Exercise.js";
import { ExerciseDate } from "../../domain/ExerciseDate.js";
import { AccountId, GymBud } from "../../domain/User.ts";
import { UserId } from "../../domain/UserId.js";
import { UserNotFoundError } from "../applicationErrors.js";
import { ExerciseRepository } from "../repositories/exerciseRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

class CreateExerciseService {
  constructor(
    private exerciseRepository: ExerciseRepository,
    private userRepository: UserRepository
  ) {}

  async execute(
    descriptionAsString: string,
    durationAsNumber: number,
    dateAsString: string | null,
    userIdAsString: string
  ): Promise<Exercise> {
    // Verify the userId is correct
    const exerciseUserId = AccountId.fromString(userIdAsString);
    // Verify an user with that id exists
    const gymbud = (await this.userRepository.findById(
      exerciseUserId
    )) as GymBud;
    if (!gymbud) {
      throw new UserNotFoundError(exerciseUserId.value);
    }
    const exercise = Exercise.create(
      descriptionAsString,
      durationAsNumber,
      gymbud,
      dateAsString
    );

    await this.exerciseRepository.create(exercise, exerciseUserId);

    return exercise;
  }
}
export { CreateExerciseService };
