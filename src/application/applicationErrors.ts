import { MyError } from "../utils/myError.js";

class ApplicationError extends MyError {}

class RepositoryError extends ApplicationError {}
class ExerciseUseCaseError extends ApplicationError {}
class NoAccountsFoundError extends ApplicationError {
  constructor() {
    super(`The user list is empty`);
  }
}

class NoExercisesFoundError extends ApplicationError {
  constructor() {
    super(`The exercise list is empty`);
  }
}

class AccountAlreadyExists extends ApplicationError {
  constructor(id: string) {
    super(`Account '${id}' already exists`);
  }
}

class AccountNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`No Account matching the id '${id}'`);
  }
}

export {
  ApplicationError,
  RepositoryError,
  ExerciseUseCaseError,
  NoAccountsFoundError,
  NoExercisesFoundError,
  AccountAlreadyExists,
  AccountNotFoundError,
};
