import { md5 } from "js-md5";

class UserId {
  constructor(value) {
    if (!value) {
      throw new Error("UserId is required");
    }

    const pattern = /^[a-fA-F0-9]{32}$/;
    if (!pattern.test(value)) {
      throw new Error("UserId must be a valid 32-character MD5 hash");
    }

    this.value = value;
    Object.freeze(this);
  }

  static generateFrom(username) {
    const id = md5(`${username}${new Date().toString()}`);
    return new UserId(id);
  }

  toString() {
    return this.value.toString();
  }

  equals(other) {
    return other instanceof UserId && other.value === this.value;
  }
}

export { UserId };
