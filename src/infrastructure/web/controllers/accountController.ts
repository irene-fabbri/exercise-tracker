import { NextFunction, Request, Response } from "express";
import { CreateAccountService } from "../../../application/useCases/createAccount.ts";
import { FindAllAccountsService } from "../../../application/useCases/findAllAccounts.ts";
import {
  formatAccountList,
  formatAccountResponse,
} from "../presenters/accountPresenter.ts";
import { ValidationError } from "../HTTPErrors.ts";

class AccountController {
  constructor(
    public createAccountService: CreateAccountService,
    public findAllAccountsService: FindAllAccountsService
  ) {}

  async createAccount(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (!request.body || !request.body.username) {
        throw new ValidationError(
          "Missing body or username attribute",
          "need a non-empty json body with a username property"
        );
      }
      const username = request.body.username;
      const newAccount = await this.createAccountService.execute(username);
      const formattedAccount = formatAccountResponse(newAccount);

      response.status(201).json(formattedAccount);
    } catch (error) {
      // to catch unexpected errors
      next(error);
    }
  }

  async findAllAccounts(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const accountList = await this.findAllAccountsService.execute();
      const formattedAccountList = formatAccountList(accountList);
      response.status(200).json(formattedAccountList);
    } catch (error) {
      next(error);
    }
  }
}

export { AccountController };
