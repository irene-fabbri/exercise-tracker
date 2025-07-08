import { NoAccountsFoundError } from "../applicationErrors.ts";
import { AccountRepository } from "../repositories/accountRepository.ts";

class FindAllAccountsService {
  constructor(private accountRepository: AccountRepository) {}

  async execute() {
    const accountList = await this.accountRepository.findAll();
    if (!accountList) {
      throw new NoAccountsFoundError();
    }
    return accountList;
  }
}
export { FindAllAccountsService };
