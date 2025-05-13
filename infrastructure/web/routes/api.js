import express from 'express';
const router = express.Router();
import { UserController } from '../controllers/userController.js';
import { ExerciseController } from '../controllers/exerciseController.js';

// /api/users
router.get('/users', UserController.findAllUsers)  
router.post('/users', UserController.createUser);

// /api/users/:_id/exercises
router.post('/users/:id/exercises', ExerciseController.createExercise);

// /api/users/:_id/logs
router.get('/users/:id/logs', ExerciseController.getLogs);

export { router as apiRoutes };