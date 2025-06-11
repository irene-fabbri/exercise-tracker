import { InvalidUsernameError } from "./domainErrors.js";

class Username {
  constructor(public readonly value: string) {
    const trimmed = value.trim();
    if (trimmed.length < 3 || trimmed.length > 30) {
      throw new InvalidUsernameError(value);
    }
    this.value = trimmed;
    Object.freeze(this);
  }
  equals(other: unknown): other is Username {
    return other instanceof Username && other.value === this.value;
  }
}

export { Username };
