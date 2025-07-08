class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    console.error(`${this.name}: ${message}`);
  }
}

export { MyError };
