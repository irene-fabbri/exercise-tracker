import { Exercise } from '../../domain/Exercise.js';
import { UserId } from '../../domain/UserId.js';
import { ExerciseUseCaseError } from '../applicationErrors.js';

class CreateExerciseService {
    constructor(exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    async execute(exercise, exerciseUserId){

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

        let userId;
        try {
            userId = new UserId(exerciseUserId);
        } catch (error) {
            console.error('Invalid user id', error)
            throw new ExerciseUseCaseError('Invalid UserId', { cause: error });
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