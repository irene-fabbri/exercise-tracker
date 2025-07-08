import { jest } from "@jest/globals";
import { FindAllAccountsService } from "../application/useCases/findAllAccounts.ts";
import { AccountRepository } from "../application/repositories/accountRepository.ts";
import { NoAccountsFoundError } from "../application/applicationErrors.ts";
import { Account } from "../domain/Account.ts";

describe("FindAllAccountsService", () => {
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  let service: FindAllAccountsService;

  beforeEach(() => {
    mockAccountRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      store: jest.fn(),
      delete: jest.fn(),
      findByProperty: jest.fn(),
    };
    service = new FindAllAccountsService(mockAccountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns the list of accounts if found", async () => {
    const accounts = [{} as Account, {} as Account];
    // returns an array of accounts if found
    mockAccountRepository.findAll.mockResolvedValue(accounts);

    const result = await service.execute();

    expect(mockAccountRepository.findAll).toHaveBeenCalled();
    expect(result).toBe(accounts);
  });

  it("throws NoAccountsFoundError if no accounts are found", async () => {
    // returns null if not found
    mockAccountRepository.findAll.mockResolvedValue(null);

    await expect(service.execute()).rejects.toThrow(NoAccountsFoundError);
    expect(mockAccountRepository.findAll).toHaveBeenCalled();
  });
});
