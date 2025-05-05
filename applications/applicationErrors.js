class ApplicationError extends Error {
    constructor(message, options = {}) {
        super(message, options.cause ? { cause:options.cause } : undefined);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class RepositoryError extends ApplicationError {};
class ExerciseUseCaseError extends ApplicationError {};
class UserUseCaseError extends ApplicationError {};

export {
    ApplicationError,
    RepositoryError,
    ExerciseUseCaseError,
    UserUseCaseError
};