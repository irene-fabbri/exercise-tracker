import { MyError } from '../utils/myError.js';

class ApplicationError extends MyError {};

class RepositoryError extends ApplicationError {};
class ExerciseUseCaseError extends ApplicationError {};
class UserUseCaseError extends ApplicationError {};

export {
    ApplicationError,
    RepositoryError,
    ExerciseUseCaseError,
    UserUseCaseError
};