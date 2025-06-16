import { UserId } from "../../domain/UserId.js";
import { NoExercisesFoundError } from "../applicationErrors.js";
class FindExerciseByUserIdService {
    exerciseRepository;
    constructor(exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }
    async execute(idAsString) {
        const userId = new UserId(idAsString);
        const exerciseList = await this.exerciseRepository.findByUserId(userId);
        if (!exerciseList) {
            throw new NoExercisesFoundError();
        }
        return exerciseList;
    }
}
export { FindExerciseByUserIdService };
