import { CreateExerciseService } from '../../../application/useCases/createExercise.js';
import { GetUserByIdService } from '../../../application/useCases/getUserById.js';
import { Exercise } from '../../../domain/Exercise.js';
import { UserId } from '../../../domain/UserId.js';
import { Exercises } from '../models/Exercises.js';
import { formatExerciseResponse, formatLogsResponse } from '../presenters/exercisePresenter.js';
import { createError } from '../utils/createError.js';

class ExerciseController {

    static async createExercise(req, res, next) {
        // validate input: userId
        let userId
        try {
            userId = new UserId(req.params.id);
        } catch (error) {
            console.error('Invalid user id', error)
            return next(createError(
                'Invlid parameters: id',
                400,
                'validation_error',
                'Invalid user id',
                error.details[0].message
              ));
        }
        
        // Validate input: exercise
        let newExercise;
        try {
            newExercise = new Exercise(req.body.description, req.body.duration, req.body.date??null)
        } catch (error) 
        {
            console.error('Invalid exercise parameters', error)
            return next(createError(
                'Invalid parameters: exercise',
                400,
                'validation_error',
                'Invalid exercise data',
                error.details[0].message
              ));
        }

        // find corrisponding user
        let user;
        try{
            user = await GetUserByIdService(userId);
        } catch (error) {
            console.error('User not found', error)
            return next(createError(
                'Invalid parameters: userId',
                400,
                'validation_error',
                'Invalid userId data',
                error.details[0].message
              ));
        }

        try {
            const savedExercise = await CreateExerciseService(newExercise, userId);
            const formatted = formatExerciseResponse(savedExercise, user);
            res.status(201).json(formatted);
        } catch (error) {
            next(error);
        }
    }

    static async getLogs(req, res, next) {
        // validate input: userId
        let userId;
        try {
            userId = new UserId(req.params.id);
        } catch (error) {
            console.error('Invalid user id', error)
            return next(createError(
                'Invlid parameters: id',
                400,
                'validation_error',
                'Invalid user id',
                error.details[0].message
            ));
        }
            
        // find corrisponding user
        let user;
        try{
            user = await GetUserByIdService(userId);
        } catch (error) {
            console.error('User not found', error)
            return next(createError(
                'Invalid parameters: userId',
                400,
                'validation_error',
                'Invalid userId data',
                error.details[0].message
            ));
        }

        try {
            const userLogs = await Exercises.findByUser(userId);
            const formatted = formatLogsResponse(user, userLogs)
            res.status(200).json(formatted);
        } catch (error) {
            next(error);
        }
    }
}

export { ExerciseController };