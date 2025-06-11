// Abstract User Repository
import { Account, AccountId, GymBud } from "../../domain/User.js";
import { Username } from "../../domain/Username.js";

interface UserRepository {
  findByUsername(username: Username): Promise<Account | null>;
  findById(id: AccountId): Promise<Account | null>;
  create(user: GymBud): Promise<void>;
  findAll(): Promise<Account[] | null>;
}

export { UserRepository };
