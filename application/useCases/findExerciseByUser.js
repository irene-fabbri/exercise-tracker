import { Exercise } from '../../domain/Exercise.js';
import { ExerciseUseCaseError } from '../applicationErrors.js';

class FindExerciseByUserIdService {
    constructor(exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    async execute(id) {
        let userId;
        try {
            userId = new UserId(id);
        } catch (error) {
            console.error('Invalid user id', error)
            throw new ExerciseUseCaseError('Invalid UserId', { cause: error });
        }

        try {
            const result = await this.exerciseRepository.findByUserId(userId);
            const resultMap = result.map(row => new Exercise(row.description, row.duration, row.date));
            return resultMap;
        }
        catch (error) {
            console.error('Exercise find by user failed:', error);
            throw new ExerciseUseCaseError('Error finding exercise by user', { cause:error });
        }
    }
}

export { FindExerciseByUserIdService }