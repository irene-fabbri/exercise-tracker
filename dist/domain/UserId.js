import { md5 } from "js-md5";
import { InvalidUserId } from "./domainErrors.js";
class UserId {
    value;
    constructor(value) {
        this.value = value;
        const pattern = /^[a-fA-F0-9]{32}$/;
        if (!pattern.test(value)) {
            throw new InvalidUserId();
        }
        this.value = value;
        Object.freeze(this);
    }
    static generateFromUsername(username) {
        return new UserId(UserId.hash(username.value));
    }
    static hash(value) {
        const hash = md5(`${value}${new Date().toString()}`);
        return hash;
    }
    equals(other) {
        return other instanceof UserId && other.value === this.value;
    }
}
export { UserId };
