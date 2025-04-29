class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

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
