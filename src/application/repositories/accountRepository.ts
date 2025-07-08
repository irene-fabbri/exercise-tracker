// Abstract Account Repository
import { Account, GymBud } from "../../domain/Account.ts";
import { Username } from "../../domain/Username.ts";
import { EntityRepository } from "./EntityRepository.ts";

interface AccountRepository extends EntityRepository<Account> {
  create(account: GymBud): Promise<void>;
  findByUsername(username: Username): Promise<Account | null>;
}

export type { AccountRepository };
