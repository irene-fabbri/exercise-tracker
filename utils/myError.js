class MyError extends Error {
  constructor(message, options = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = this.constructor.name;
    this.code = options.code || null;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { MyError };
