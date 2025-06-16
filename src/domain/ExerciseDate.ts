import { InvalidDateError } from "./domainErrors.js";

class ExerciseDate {
  private constructor(public readonly value: Date) {
    Object.freeze(this);
  }

  equals(other: unknown): other is ExerciseDate {
    return (
      other instanceof ExerciseDate &&
      this.value.getTime() === other.value.getTime()
    );
  }

  static now(): ExerciseDate {
    return new ExerciseDate(new Date());
  }

  static fromString(value: string): ExerciseDate {
    const timestamp = Date.parse(value);

    if (isNaN(timestamp)) {
      throw new InvalidDateError("Invalid date format");
    }

    const parsed = new Date(timestamp);
    const now = new Date();

    if (parsed > now) {
      throw new InvalidDateError("Date cannot be in the future");
    }

    return new ExerciseDate(parsed);
  }
}

export { ExerciseDate };
