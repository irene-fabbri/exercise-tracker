import { InvalidUsernameError } from "./domainErrors.js";
class Username {
    value;
    constructor(value) {
        this.value = value;
        const trimmed = value.trim();
        if (trimmed.length < 3 || trimmed.length > 30) {
            throw new InvalidUsernameError(value);
        }
        this.value = trimmed;
        Object.freeze(this);
    }
    equals(other) {
        return other instanceof Username && other.value === this.value;
    }
}
export { Username };
