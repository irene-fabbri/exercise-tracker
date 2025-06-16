import express, { NextFunction, Request, Response, response } from "express";
import {
  getExerciseController,
  getUserController,
} from "../../../config/dependencies.ts";
const router = express.Router();

// /api/users
router.get(
  "/users",
  (request: Request, response: Response, next: NextFunction) =>
    getUserController().findAllUsers(request, response, next)
);
router.post(
  "/users",
  (request: Request, response: Response, next: NextFunction) =>
    getUserController().createUser(request, response, next)
);

// /api/users/:_id/exercises
router.post(
  "/users/:id/exercises",
  (request: Request, response: Response, next: NextFunction) =>
    getExerciseController().createExercise(request, response, next)
);

// /api/users/:_id/logs
router.get(
  "/users/:id/logs",
  (request: Request, response: Response, next: NextFunction) =>
    getExerciseController().getLogs(request, response, next)
);

export { router as apiRoutes };
