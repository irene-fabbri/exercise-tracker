import { MyError } from "../utils/myError.js";
class DomainError extends MyError {
}
class InvalidDescriptionError extends DomainError {
}
class InvalidDurationError extends DomainError {
    constructor(value) {
        super(`Invalid duration provided: ${value}:duration must be a positive integer (in minutes)`);
    }
}
class InvalidDateError extends DomainError {
}
class InvalidUsernameError extends DomainError {
    constructor(username) {
        super(`Invalid username provided: ${username}: Username must be at least 3 and at most 30 characters long, excluding empty trailing and ending spaces`);
    }
}
class InvalidUserId extends DomainError {
    constructor() {
        super(`UserId must be a valid 32-character MD5 hash`);
    }
}
export { DomainError, InvalidDescriptionError, InvalidDurationError, InvalidDateError, InvalidUsernameError, InvalidUserId, };
