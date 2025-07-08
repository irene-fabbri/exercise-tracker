// api.ts
import express, { NextFunction, Request, Response } from "express";
import { AccountController } from "../controllers/accountController.ts";
import { ExerciseController } from "../controllers/exerciseController.ts";

export function createApiRoutes(
  accountController: AccountController,
  exerciseController: ExerciseController
) {
  const router = express.Router();

  router.get("/users", (req: Request, res: Response, next: NextFunction) =>
    accountController.findAllAccounts(req, res, next)
  );

  router.post("/users", (req: Request, res: Response, next: NextFunction) =>
    accountController.createAccount(req, res, next)
  );

  router.post(
    "/users/:id/exercises",
    (req: Request, res: Response, next: NextFunction) =>
      exerciseController.createExercise(req, res, next)
  );

  router.get(
    "/users/:id/logs",
    (req: Request, res: Response, next: NextFunction) =>
      exerciseController.getLogs(req, res, next)
  );

  return router;
}
