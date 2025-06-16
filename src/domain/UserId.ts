import { md5 } from "js-md5";
import { InvalidUserId } from "./domainErrors.js";
import { Username } from "./Username.js";

class UserId {
  constructor(public readonly value: string) {
    const pattern = /^[a-fA-F0-9]{32}$/;
    if (!pattern.test(value)) {
      throw new InvalidUserId();
    }
    this.value = value;
    Object.freeze(this);
  }

  static generateFromUsername(username: Username): UserId {
    return new UserId(UserId.hash(username.value));
  }

  private static hash(value: string): string {
    const hash = md5(`${value}${new Date().toString()}`);
    return hash;
  }
  equals(other: unknown): other is UserId {
    return other instanceof UserId && other.value === this.value;
  }
}

export { UserId };
