import { MyError } from "../../utils/myError.js";

class HTTPError extends MyError {
  constructor(
    message,
    status = 500,
    code = "internal_error",
    title = "Internal Server Error",
    detail = null,
    options = {}
  ) {
    super(message, { cause: options.cause, code });
    this.status = status;
    this.title = title;
    this.detail = detail || message;
  }
}

class ValidationError extends HTTPError {
  constructor(title, detail, cause = null) {
    super("Validation Error", 400, "validation_error", title, detail, {
      cause,
    });
  }
}

class NotFoundError extends HTTPError {
  constructor(title, detail, cause = null) {
    super("Not Found", 404, "not_found", title, detail, { cause });
  }
}
export { HTTPError, ValidationError, NotFoundError };
