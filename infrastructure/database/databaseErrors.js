import { MyError } from "../../utils/myError.js";

class DatabaseError extends MyError {}

class DatabaseAccessError extends DatabaseError {}
class DatabaseCreateError extends DatabaseError {}
class DatabaseReadError extends DatabaseError {}

export {
  DatabaseError,
  DatabaseAccessError,
  DatabaseCreateError,
  DatabaseReadError,
};
