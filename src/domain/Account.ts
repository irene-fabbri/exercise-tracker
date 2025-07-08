import { InvalidAccountId } from "./domainErrors.ts";
import { Entity } from "./Entity.ts";
import { Identifier } from "./Identifier.ts";
import { Username } from "./Username.ts";

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
    if (!Identifier.isValid(id)) {
      throw new InvalidAccountId();
    }

    return new AccountId(id);
  }
}

class Account extends Entity {
  constructor(id: AccountId, public readonly username: Username) {
    super(id);
  }
}

class GymManager extends Account {}
class GymBud extends Account {}

type User = GymBud | GymManager;

export { GymBud, GymManager, AccountId, Account };
export type { User };
