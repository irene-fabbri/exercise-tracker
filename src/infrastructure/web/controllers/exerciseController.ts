import { NextFunction, Request, Response } from "express";
import { CreateExerciseService } from "../../../application/useCases/createExercise.js";
import { FindExerciseByUserIdService } from "../../../application/useCases/findExerciseByUser.js";

import { NotFoundError, ValidationError } from "../HTTPErrors.js";
import {
  formatExerciseResponse,
  formatLogsResponse,
} from "../presenters/exercisePresenter.js";
import { FindUserByIdService } from "../../../application/useCases/findUserById.js";

class ExerciseController {
  constructor(
    public createExerciseService: CreateExerciseService,
    public findUserByIdService: FindUserByIdService,
    public findExerciseByUserIdService: FindExerciseByUserIdService
  ) {}

  async createExercise(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (
        !request.body ||
        !request.body.description ||
        !request.body.duration
      ) {
        throw new ValidationError(
          "Missing body or its description and duration attributes",
          "need a non-empty json body with description and duration properties"
        );
      }

      const description: string = request.body.description;
      const duration: number = request.body.duration;
      const date: string | null = request.body.date || null;
      const userId = request.params.id;

      const user = await this.findUserByIdService.execute(userId);
      if (!user) {
        throw new NotFoundError(`No user found with id '${userId}'`);
      }

      const newExercise = await this.createExerciseService.execute(
        description,
        duration,
        date,
        userId
      );

      const formatted = formatExerciseResponse(newExercise, user);
      response.status(201).json(formatted);
    } catch (error) {
      // to catch unexpected errors
      next(error);
    }
  }

  async getLogs(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = request.params.id;
      // find corrisponding user
      const user = await this.findUserByIdService.execute(userId);
      if (!user) {
        throw new NotFoundError(`No user found with id '${userId}'`);
      }

      const userLogs = await this.findExerciseByUserIdService.execute(userId);
      const formatted = formatLogsResponse(user, userLogs);
      response.status(200).json(formatted);
    } catch (error) {
      next(error);
    }
  }
}

export { ExerciseController };
