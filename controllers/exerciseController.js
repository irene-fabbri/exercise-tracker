const Exercises = require('../models/Exercises');

class ExerciseController {

    static async createExercise(req, res, next) {
        const userId = req.params.id;
        const exerciseInfo = req.body;
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

module.exports = ExerciseController;