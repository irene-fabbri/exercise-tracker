import express from "express";
import { getExerciseController, getUserController, } from "../../../config/dependencies.js";
const router = express.Router();
// /api/users
router.get("/users", (request, response, next) => getUserController().findAllUsers(request, response, next));
router.post("/users", (request, response, next) => getUserController().createUser(request, response, next));
// /api/users/:_id/exercises
router.post("/users/:id/exercises", (request, response, next) => getExerciseController().createExercise(request, response, next));
// /api/users/:_id/logs
router.get("/users/:id/logs", (request, response, next) => getExerciseController().getLogs(request, response, next));
export { router as apiRoutes };
