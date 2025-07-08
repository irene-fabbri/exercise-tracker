import { AccountAlreadyExists } from "../../application/applicationErrors.js";
import { AccountId, GymBud } from "../../domain/Account.ts";
import { Username } from "../../domain/Username.js";
import { AccountRepository } from "../repositories/accountRepository.ts";

class CreateAccountService {
  constructor(private accountRepository: AccountRepository) {}

  async execute(usernameAsString: string): Promise<GymBud> {
    const username: Username = new Username(usernameAsString);
    const existingAccount = await this.accountRepository.findByUsername(
      username
    );

    if (existingAccount) {
      throw new AccountAlreadyExists(username.value);
    }

    const userId = AccountId.create();
    const newAccount = new GymBud(userId, username);
    await this.accountRepository.create(newAccount);
    return newAccount;
  }
}
export { CreateAccountService };
