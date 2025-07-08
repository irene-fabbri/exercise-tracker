import { jest } from "@jest/globals";
import { CreateAccountService } from "../application/useCases/createAccount.ts";
import { AccountAlreadyExists } from "../application/applicationErrors.ts";
import { GymBud } from "../domain/Account.ts";
import { Username } from "../domain/Username.ts";
import type { AccountRepository } from "../application/repositories/accountRepository.ts";

describe("CreateAccountService", () => {
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  let service: CreateAccountService;

  beforeEach(() => {
    mockAccountRepository = {
      findByUsername: jest.fn(),
      create: jest.fn(),
      store: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByProperty: jest.fn(),
    };
    service = new CreateAccountService(mockAccountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates a new account if username does not exist", async () => {
    // New User: findByUsername returns null
    mockAccountRepository.findByUsername.mockResolvedValue(null);
    // Simulate a successfull call to create
    mockAccountRepository.create.mockResolvedValue();

    const username = "newuser";
    const result = await service.execute(username);

    expect(result).toBeInstanceOf(GymBud);
    expect(result.username.value).toBe(username);
    expect(mockAccountRepository.findByUsername).toHaveBeenCalledWith(
      new Username(username)
    );
    expect(mockAccountRepository.create).toHaveBeenCalledWith(
      expect.any(GymBud)
    );
  });

  it("throws AccountAlreadyExists if username exists", async () => {
    const username = "existinguser";
    const existingAccount = {} as GymBud;
    // Existing User: findByUsername returns an exixting account
    mockAccountRepository.findByUsername.mockResolvedValue(existingAccount);

    await expect(service.execute(username)).rejects.toThrow(
      AccountAlreadyExists
    );
    expect(mockAccountRepository.create).not.toHaveBeenCalled();
  });
});
