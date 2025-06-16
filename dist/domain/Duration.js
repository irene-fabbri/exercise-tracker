import { InvalidDurationError } from "./domainErrors.js";
class Duration {
    value;
    constructor(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new InvalidDurationError(value);
        }
        this.value = value;
        Object.freeze(this);
    }
    equals(other) {
        return other instanceof Duration && other.value === this.value;
    }
}
export { Duration };
