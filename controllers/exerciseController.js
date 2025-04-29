import { Exercises } from '../models/Exercises.js';
import { createError } from '../utils/createError.js';
import { createExerciseSchema } from '../validators/exerciseValidator.js';

class ExerciseController {

    static async createExercise(req, res, next) {
        const userId = req.params.id;
        // Validate input
        const { error, value: exerciseInfo } = createExerciseSchema.validate( req.body, {
            stripUnknown: true,
        });

        if (error) {
            return next(createError(
              'Validation Error',
              400,
              'validation_error',
              'Invalid user data',
              error.details[0].message
            ));
        }

        try {
            const newExercise = await Exercises.create(exerciseInfo, userId);
            res.status(201).json(newExercise);
        } catch (error) {
            next(error);
        }
    }

    static async getLogs(req, res, next) {
        const userId = req.params.id;

        try {
            const data = await Exercises.findByUser(userId);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

}

export { ExerciseController };