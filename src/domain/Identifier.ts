import { randomUUID } from "crypto";

class Identifier {
  protected constructor(public readonly value: string) {
    Object.freeze(this);
  }

  static create(): Identifier {
    return new Identifier(randomUUID());
  }
}

export { Identifier };
