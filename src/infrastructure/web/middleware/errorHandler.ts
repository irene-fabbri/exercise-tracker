import { NextFunction, Request, Response } from "express";
import { HTTPError } from "../HTTPErrors.js";
import { InvalidField } from "../../../domain/domainErrors.js";
import {
  AccountAlreadyExists,
  AccountNotFoundError,
  NoAccountsFoundError,
  NoExercisesFoundError,
} from "../../../application/applicationErrors.ts";
import {
  DatabaseAccessError,
  DatabaseConfigError,
  DatabaseConnectionError,
  DatabaseCreateError,
  DatabaseDeleteError,
  DatabaseInitializationError,
  DatabaseReadError,
} from "../../database/databaseErrors.ts";
import { MyError } from "../../../utils/myError.ts";
import { errorMonitor } from "events";

function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  let status = 500;
  let code = "internal_error";
  let title = "Internal Server Error";
  let detail = error.message;
  let errors: Record<string, string> = {};

  // Domain Validation Errors
  if (error instanceof InvalidField) {
    status = 400;
    code = "invalid_field";
    title = "Invalid input";
    errors = { field: error.message };
  }

  // Application-level errors
  else if (error instanceof AccountNotFoundError) {
    status = 404;
    code = "account_not_found";
    title = "Account not found";
  } else if (error instanceof AccountAlreadyExists) {
    status = 409;
    code = "account_conflict";
    title = "Account already exists";
  } else if (error instanceof NoAccountsFoundError) {
    status = 404;
    code = "no_accounts";
    title = "No accounts found";
  } else if (error instanceof NoExercisesFoundError) {
    status = 404;
    code = "no_exercises";
    title = "No exercises found";
  }

  // Database errors
  else if (error instanceof DatabaseReadError) {
    status = 500;
    code = "db_read_error";
    title = "Database read error";
  } else if (error instanceof DatabaseCreateError) {
    status = 500;
    code = "db_create_error";
    title = "Database create error";
  } else if (error instanceof DatabaseDeleteError) {
    status = 500;
    code = "db_delete_error";
    title = "Database delete error";
  } else if (
    error instanceof DatabaseInitializationError ||
    error instanceof DatabaseConnectionError ||
    error instanceof DatabaseConfigError ||
    error instanceof DatabaseAccessError
  ) {
    status = 500;
    code = "db_config_error";
    title = "Database configuration error";
  }

  // HTTP-specific errors (optional for use in controllers directly)
  else if (error instanceof HTTPError) {
    status = error.status;
    code = error.code;
    title = error.title;
    detail = error.message;
  }

  // Unknown errors
  else if (error instanceof MyError) {
    // Known base class
    detail = error.message;
  } else {
    // Unknown unexpected error
    console.error(`[UNHANDLED ERROR]:`, error);
    detail = "An unexpected error occurred: " + error.message;
  }

  response.status(status).json({
    status,
    code,
    title,
    detail: error.message,
    errors,
  });
}

// function errorHandler(
//   error: Error,
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) {
//   const isHttpError = error instanceof HTTPError;
//   const status = isHttpError ? error.status : 500;

//   const log = {
//     status,
//     message: error.message || "Internal Server Error",
//     code: isHttpError ? error.code : "internal_error",
//     title: isHttpError ? error.title : "An unexpected error occurred",
//     detail: isHttpError ? error.detail : error.message,
//   };

//   console.error(`[ERROR]: ${log.title} - ${log.detail}`);

//   response.status(status).json(log);
// }

export { errorHandler };
