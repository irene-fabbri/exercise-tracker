import { randomUUID } from "crypto";

class Identifier {
  protected constructor(public readonly value: string) {
    Object.freeze(this);
  }

  static create(): Identifier {
    return new Identifier(randomUUID());
  }

  static isValid(id: string) {
    const isUUIDv4 =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      );
    return isUUIDv4;
  }
}

export { Identifier };
