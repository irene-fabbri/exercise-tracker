import { Entity } from "../../domain/Entity.ts";
import { MyError } from "../../utils/myError.js";

class DatabaseError extends MyError {}

class DatabaseAccessError extends DatabaseError {}
class DatabaseCreateError extends DatabaseError {}
class DatabaseDeleteError extends DatabaseError {
  constructor(id: string) {
    super(`Error deleting the object with id: ${id}`);
  }
}
class DatabaseReadError extends DatabaseError {}
class DatabaseConfigError extends DatabaseError {
  constructor(message: string = "") {
    super("Called with wrong configuration parameters" + message);
  }
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

export {
  DatabaseError,
  DatabaseAccessError,
  DatabaseCreateError,
  DatabaseReadError,
  DatabaseInitializationError,
  DatabaseConnectionError,
  DatabaseConfigError,
  DatabaseDeleteError,
};
