import { HTTPError } from "../HTTPErrors.js";
function errorHandler(error, request, response, next) {
    const isHttpError = error instanceof HTTPError;
    const status = isHttpError ? error.status : 500;
    const log = {
        status,
        message: error.message || "Internal Server Error",
        code: isHttpError ? error.code : "internal_error",
        title: isHttpError ? error.title : "An unexpected error occurred",
        detail: isHttpError ? error.detail : error.message,
    };
    console.error(`[ERROR]: ${log.title} - ${log.detail}`);
    response.status(status).json(log);
}
export { errorHandler };
