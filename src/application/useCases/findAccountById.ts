import { AccountId, Account } from "../../domain/Account.ts";
import { AccountNotFoundError } from "../applicationErrors.ts";
import { AccountRepository } from "../repositories/accountRepository.ts";

class FindAccountByIdService {
  constructor(private accountRepository: AccountRepository) {}

  async execute(id: string): Promise<Account> {
    const accountId = AccountId.fromString(id);
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new AccountNotFoundError(accountId.value);
    }
    return account;
  }
}
export { FindAccountByIdService };
