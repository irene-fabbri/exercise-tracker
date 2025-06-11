import { NextFunction, Request, Response } from "express";
import { HTTPError } from "../HTTPErrors.js";
import { InvalidField } from "../../../domain/domainErrors.js";

function errorHandler2(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof InvalidField) {
    response.status(400).json({
      message: error.message,
      errors: {},
    });
  }
}

function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const isHttpError = error instanceof HTTPError;
  const status = isHttpError ? error.status : 500;

  const log = {
    status,
    message: error.message || "Internal Server Error",
    code: isHttpError ? error.code : "internal_error",
    title: isHttpError ? error.title : "An unexpected error occurred",
    detail: isHttpError ? error.detail : error.message,
  };

  console.error(`[ERROR]: ${log.title} - ${log.detail}`);

  response.status(status).json(log);
}

export { errorHandler };
