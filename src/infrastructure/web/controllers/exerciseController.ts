import { NextFunction, Request, Response } from "express";
import { CreateExerciseService } from "../../../application/useCases/createExercise.js";
import { FindExerciseByAccountIdService } from "../../../application/useCases/findExerciseByAccount.ts";

import { NotFoundError, ValidationError } from "../HTTPErrors.js";
import {
  formatExerciseResponse,
  formatLogsResponse,
} from "../presenters/exercisePresenter.js";
import { FindAccountByIdService } from "../../../application/useCases/findAccountById.ts";

class ExerciseController {
  constructor(
    public createExerciseService: CreateExerciseService,
    public findAccountByIdService: FindAccountByIdService,
    public findExerciseByAccountIdService: FindExerciseByAccountIdService
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

      const account = await this.findAccountByIdService.execute(userId);
      if (!account) {
        throw new NotFoundError(`No user found with id '${userId}'`);
      }

      const newExercise = await this.createExerciseService.execute(
        description,
        duration,
        date,
        userId
      );

      const formatted = formatExerciseResponse(newExercise, account);
      response.status(201).json(formatted);
    } catch (error) {
      // to catch unexpected errors
      next(error);
    }
  }

  async getLogs(request: Request, response: Response, next: NextFunction) {
    try {
      const accountId = request.params.id;
      // find corrisponding user
      const account = await this.findAccountByIdService.execute(accountId);
      if (!account) {
        throw new NotFoundError(`No account found with id '${accountId}'`);
      }

      const accountLogs = await this.findExerciseByAccountIdService.execute(
        accountId
      );
      const formattedLogs = formatLogsResponse(account, accountLogs);
      response.status(200).json(formattedLogs);
    } catch (error) {
      next(error);
    }
  }
}

export { ExerciseController };
