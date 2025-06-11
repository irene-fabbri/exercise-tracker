import { InvalidDescriptionError } from "./domainErrors.js";
class Description {
    value;
    constructor(value) {
        if (typeof value !== "string") {
            throw new InvalidDescriptionError("Description MUST be a string");
        }
        const trimmed = value.trim();
        if (trimmed.length < 1) {
            throw new InvalidDescriptionError("Description must not be empty");
        }
        this.value = trimmed;
        Object.freeze(this);
    }
    equals(other) {
        return other instanceof Description && other.value === this.value;
    }
}
export { Description };
