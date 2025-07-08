import { jest } from "@jest/globals";
import { FindAccountByIdService } from "../application/useCases/findAccountById.ts";
import { AccountRepository } from "../application/repositories/accountRepository.ts";
import { AccountId, Account } from "../domain/Account.ts";
import { AccountNotFoundError } from "../application/applicationErrors.ts";

describe("FindAccountByIdService", () => {
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  let service: FindAccountByIdService;

  beforeEach(() => {
    mockAccountRepository = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      store: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findByProperty: jest.fn(),
    };
    service = new FindAccountByIdService(mockAccountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns the account if found", async () => {
    const id = AccountId.create().value;
    const accountId = AccountId.fromString(id);
    const account = {} as Account;
    // found: returns account
    mockAccountRepository.findById.mockResolvedValue(account);

    const result = await service.execute(id);

    expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(result).toBe(account);
  });

  it("throws AccountNotFoundError if account does not exist", async () => {
    const id = AccountId.create().value;
    const accountId = AccountId.fromString(id);
    // not found: returns null
    mockAccountRepository.findById.mockResolvedValue(null);

    await expect(service.execute(id)).rejects.toThrow(AccountNotFoundError);
    expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId);
  });
});
