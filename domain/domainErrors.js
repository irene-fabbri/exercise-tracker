import { MyError } from '../utils/myError.js';

class DomainError extends MyError {};

class InvalidDescriptionError extends DomainError {};
class InvalidDurationError extends DomainError {};
class InvalidDateError extends DomainError {};
class InvalidUsernameError extends DomainError {};

export {
    DomainError,
    InvalidDescriptionError,
    InvalidDurationError,
    InvalidDateError,
    InvalidUsernameError
};
