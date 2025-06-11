import { MyError } from "../utils/myError.js";

class ApplicationError extends MyError {}

class RepositoryError extends ApplicationError {}
class ExerciseUseCaseError extends ApplicationError {}
class NoUsersFoundError extends ApplicationError {
  constructor() {
    super(`The user list is empty`);
  }
}

class NoExercisesFoundError extends ApplicationError {
  constructor() {
    super(`The exercise list is empty`);
  }
}

class UserAlreadyExists extends ApplicationError {
  constructor(userId: string) {
    super(`User '${userId}' already exists`);
  }
}

class UserNotFoundError extends ApplicationError {
  constructor(userId: string) {
    super(`No User matching the id '${userId}'`);
  }
}

export {
  ApplicationError,
  RepositoryError,
  ExerciseUseCaseError,
  NoUsersFoundError,
  NoExercisesFoundError,
  UserAlreadyExists,
  UserNotFoundError,
};
