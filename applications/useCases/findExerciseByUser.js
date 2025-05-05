import { Exercise } from '../../domain/Exercise.js';
import { ExerciseUseCaseError } from '../applicationErrors.js';

class FindExerciseByUserIdService {
    constructor(exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    #validate(id) {
        if (!id || typeof id !== 'string') {
            throw new UserUseCaseError('Missing or wrongly fromatted fields: id');
        };    
    }

    async execute(id) {
        this.#validate(id);

        try {
            const result = await this.exerciseRepository.findByUserId(id);
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