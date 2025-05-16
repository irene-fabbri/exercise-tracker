function getRootCause(error) {
  let current = error;
  while (current?.cause) {
    current = current.cause;
  }
  return current;
}

function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const response = {
    status,
    message: error.message || "Internal Server Error",
    code: error.code || "internal_error",
    title: error.title || "An unexpected error occurred",
    detail: error.detail || error.message || "No additional details available.",
    cause: getRootCause(error.cause),
  };

  console.error(`[ERROR]: ${response.title} - ${response.detail}`);

  res.status(status).json(response);
}

export { errorHandler };
