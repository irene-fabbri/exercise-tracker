import { Exercise } from '../../domain/Exercise.js';
import { ExerciseUseCaseError } from '../applicationErrors.js';

class CreateExerciseService {
    constructor(exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    #validate(exercise) {
        if (!exercise || !exercise.description || !exercise.duration) {
            throw new ExerciseUseCaseError('Missing required fields: description and duration.');
        };    
    }

    async execute(exercise) {
        this.#validate(exercise);

        let newExercise;
        try {
            newExercise = new Exercise(
                exercise.description,
                exercise.duration,
                exercise.date
            );
        }
        catch (error) {
            console.error('Invalid exercise data', error);
            throw new ExerciseUseCaseError('Invalid exercise data', { cause: error });
        }

        try {
            const resultingExercise = await this.exerciseRepository.create(newExercise, userId);
            return resultingExercise;
        }
        catch (error) {
            console.error('Exercise creation failed:', error);
            throw new ExerciseUseCaseError('Error creating exercise', { cause:error });
        }
    }
};
export { CreateExerciseService };