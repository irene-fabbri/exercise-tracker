class MyError extends Error {
    constructor(message) {
        super(message);
        this.name = new.target.name;
        // Set the prototype explicitly to maintain the correct prototype chain
        Object.setPrototypeOf(this, MyError.prototype);
    }
}
export { MyError };
