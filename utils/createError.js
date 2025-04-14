function createError(message, status = 500, code = 'internal_error', title = 'Internal Error', detail = '') {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    error.title = title;
    error.detail = detail || message;
    return error;
}

module.exports = createError;