import { InvalidDateError } from "./domainErrors.js";
class ExerciseDate {
    value;
    constructor(value) {
        const now = new Date();
        let parsed;
        if (!value) {
            parsed = now;
        }
        else if (value instanceof Date) {
            parsed = value;
        }
        else {
            const timestamp = Date.parse(value);
            if (isNaN(timestamp)) {
                throw new InvalidDateError("Invalid date format");
            }
            parsed = new Date(timestamp);
        }
        if (parsed > now) {
            throw new InvalidDateError("Date cannot be in the future");
        }
        this.value = parsed;
        Object.freeze(this);
    }
    equals(other) {
        return (other instanceof ExerciseDate &&
            this.value.getTime() === other.value.getTime());
    }
}
export { ExerciseDate };
