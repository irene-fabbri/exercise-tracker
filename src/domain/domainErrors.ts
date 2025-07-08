import { MyError } from "../utils/myError.js";

class DomainError extends MyError {}

class InvalidField extends DomainError {}

class InvalidDescriptionError extends InvalidField {
  private constructor(message: string) {
    super(message);
  }

  static notAString(): InvalidDescriptionError {
    return new InvalidDescriptionError("Description MUST be a string");
  }

  static empty(): InvalidDescriptionError {
    return new InvalidDescriptionError("Description must not be empty");
  }
}

class InvalidDurationError extends InvalidField {
  constructor(value: number) {
    super(
      `Invalid duration provided: ${value}:duration must be a positive integer (in minutes)`
    );
  }
}
class InvalidDateError extends InvalidField {}
class InvalidUsernameError extends InvalidField {
  constructor(username: string) {
    super(
      `Invalid username provided: ${username}: Username must be at least 3 and at most 30 characters long, excluding empty trailing and ending spaces`
    );
  }
}

class InvalidAccountId extends InvalidField {
  constructor() {
    super(`AccountId must be a valid UUID v4 string`);
  }
}

export {
  DomainError,
  InvalidField,
  InvalidDescriptionError,
  InvalidDurationError,
  InvalidDateError,
  InvalidUsernameError,
  InvalidAccountId,
};
