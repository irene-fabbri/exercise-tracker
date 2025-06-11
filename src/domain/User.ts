import { Identifier } from "./Identifier.ts";
import { UserId } from "./UserId.js";
import { Username } from "./Username.js";

class AccountId extends Identifier {
  private constructor(value: string) {
    super(value);
  }
  // to create an account Identifier
  static create() {
    return new AccountId(Identifier.create().value);
  }
  // for account id read from databases
  static fromString(id: string) {
    return new AccountId(id);
  }
}

class Account {
  constructor(
    public readonly id: AccountId,
    public readonly username: Username
  ) {}
}

class GymManager extends Account {}
class GymBud extends Account {}

type User = GymBud | GymManager;
// Class User to be DELETED
// class User {
//   constructor(public readonly id: UserId, public readonly username: Username) {}
// }

export { User, GymBud, GymManager, AccountId, Account };
