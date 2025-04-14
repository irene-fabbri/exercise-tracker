function errorHandler(error, req, res, next) {
    const status = error.status || 500;
    const response = {
        status,
        message: error.message || 'Internal Server Error',
        code: error.code || 'internal_error',
        title: error.title || 'An unexpected error occurred',
        detail: error.detail || error.message || 'No additional details available.'
    };

    console.error(`[ERROR]: ${response.title} - ${response.detail}`);

    res.status(status).json(response);
}

module.exports = errorHandler;