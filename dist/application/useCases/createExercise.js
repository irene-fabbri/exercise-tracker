import { Description } from "../../domain/Description.js";
import { Duration } from "../../domain/Duration.js";
import { Exercise } from "../../domain/Exercise.js";
import { ExerciseDate } from "../../domain/ExerciseDate.js";
import { UserId } from "../../domain/UserId.js";
import { UserNotFoundError } from "../applicationErrors.js";
class CreateExerciseService {
    exerciseRepository;
    userRepository;
    constructor(exerciseRepository, userRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
    }
    async execute(descriptionAsString, durationAsNumber, dateAsString, userIdAsString) {
        // Verify the userId is correct
        const exerciseUserId = new UserId(userIdAsString);
        // Verify an user with that id exists
        const user = await this.userRepository.findById(exerciseUserId);
        if (!user) {
            throw new UserNotFoundError(exerciseUserId.value);
        }
        const description = new Description(descriptionAsString);
        const duration = new Duration(durationAsNumber);
        const date = new ExerciseDate(dateAsString ?? new Date());
        const exercise = new Exercise(description, duration, date);
        await this.exerciseRepository.create(exercise, exerciseUserId);
        return exercise;
    }
}
export { CreateExerciseService };
