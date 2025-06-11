import { MyError } from "../../utils/myError.js";

class HTTPError extends MyError {
  constructor(
    message: string,
    public status = 500,
    public code = "internal_error",
    public title = "Internal Server Error",
    public detail: string | null = null
  ) {
    super(message);

    const finalDetail = detail || message;

    this.detail = finalDetail;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ValidationError extends HTTPError {
  constructor(title: string, detail: string | null = null) {
    super("Validation Error", 400, "validation_error", title, detail);
  }
}

class NotFoundError extends HTTPError {
  constructor(title: string, detail: string | null = null) {
    super("Not Found", 404, "not_found", title, detail);
  }
}
export { HTTPError, ValidationError, NotFoundError };
