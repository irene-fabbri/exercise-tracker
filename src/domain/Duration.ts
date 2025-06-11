import { InvalidDurationError } from "./domainErrors.js";

class Duration {
  public readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new InvalidDurationError(value);
    }

    this.value = value;
    Object.freeze(this);
  }

  equals(other: unknown): other is Duration {
    return other instanceof Duration && other.value === this.value;
  }
}

export { Duration };
