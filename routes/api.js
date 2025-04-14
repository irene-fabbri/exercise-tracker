const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const exerciseController = require('../controllers/exerciseController');

// /api/users
router.get('/users', userController.getAllUsers)  
router.post('/users', userController.createUser);

// /api/users/:_id/exercises

router.post('/users/:id/exercises', exerciseController.createExercise);
// /api/users/:_id/logs

router.get('/users/:id/logs', exerciseController.getLogs);

module.exports = router;