import { MyError } from '../utils/myError.js';

class DatabaseError extends MyError {}

class DatabaseAccessError extends DatabaseError{};

export {
    DatabaseError,
    DatabaseAccessError
};