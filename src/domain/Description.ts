import { InvalidDescriptionError } from "./domainErrors.js";

class Description {
  public readonly value: string;

  constructor(value: string) {
    if (typeof value !== "string") {
      throw InvalidDescriptionError.notAString();
    }

    const trimmed = value.trim();

    if (trimmed.length < 1) {
      throw InvalidDescriptionError.empty();
    }

    this.value = trimmed;
    Object.freeze(this);
  }

  equals(other: unknown): other is Description {
    return other instanceof Description && other.value === this.value;
  }
}

export { Description };
