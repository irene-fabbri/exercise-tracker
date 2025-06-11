import { MyError } from "../../utils/myError.js";
class DatabaseError extends MyError {
}
class DatabaseAccessError extends DatabaseError {
}
class DatabaseCreateError extends DatabaseError {
}
class DatabaseReadError extends DatabaseError {
}
class DatabaseInitializationError extends DatabaseError {
    constructor() {
        super("Database was not initialized");
    }
}
class DatabaseConnectionError extends DatabaseError {
    constructor() {
        super("Could not get the database");
    }
}
export { DatabaseError, DatabaseAccessError, DatabaseCreateError, DatabaseReadError, DatabaseInitializationError, DatabaseConnectionError, };
