import { createExerciseService } from '../../../config/dependencies.js';
import { findExerciseByUserIdService } from '../../../config/dependencies.js';
import { getUserByIdService } from '../../../config/dependencies.js';

import { Exercise } from '../../../domain/Exercise.js';
import { UserId } from '../../../domain/UserId.js';
import { NotFoundError, ValidationError } from '../HTTPErrors.js';
import { formatExerciseResponse, formatLogsResponse } from '../presenters/exercisePresenter.js';

class ExerciseController {

    static async createExercise(req, res, next) {
        // validate input: userId
        let userId
        try {
            userId = new UserId(req.params.id);
        } catch (error) {
            console.error('Invalid user id', error)
            return next( new ValidationError('Invalid parameters: id', error.details?.[0]?.message || error.message, error) );
        }
        
        // Validate input: exercise
        let newExercise;
        try {
            newExercise = new Exercise(req.body.description, req.body.duration, req.body.date??null)
        } catch (error) 
        {
            console.error('Invalid exercise parameters', error)
            return next( new ValidationError('Invalid parameters: username', error.details?.[0]?.message || error.message, error) );
        }

        // find corrisponding user
        let user;
        try{
            user = await getUserByIdService.execute(userId);
        } catch (error) {
            console.error('User not found', error);
            return next( new NotFoundError('User not found', error.details?.[0]?.message || error.message, error) );
        }

        try {
            const savedExercise = await createExerciseService.execute(newExercise, userId);
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
            return next( new ValidationError('Invalid parameters: username', error.details?.[0]?.message || error.message, error) );
        }
            
        // find corrisponding user
        let user;
        try{
            user = await getUserByIdService.execute(userId);
        } catch (error) {
            console.error('User not found', error)
            return next( new NotFoundError('User not found', error.details?.[0]?.message || error.message, error) );
        }

        try {
            const userLogs = await findExerciseByUserIdService.execute(userId);
            const formatted = formatLogsResponse(user, userLogs)
            res.status(200).json(formatted);
        } catch (error) {
            next(error);
        }
    }
}

export { ExerciseController };