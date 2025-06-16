import { MyError } from "../../utils/myError.js";
class HTTPError extends MyError {
    status;
    code;
    title;
    detail;
    constructor(message, status = 500, code = "internal_error", title = "Internal Server Error", detail = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.title = title;
        this.detail = detail;
        const finalDetail = detail || message;
        this.detail = finalDetail;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class ValidationError extends HTTPError {
    constructor(title, detail = null) {
        super("Validation Error", 400, "validation_error", title, detail);
    }
}
class NotFoundError extends HTTPError {
    constructor(title, detail = null) {
        super("Not Found", 404, "not_found", title, detail);
    }
}
export { HTTPError, ValidationError, NotFoundError };
