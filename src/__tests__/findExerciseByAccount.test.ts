import { jest } from "@jest/globals";
import { FindExerciseByAccountIdService } from "../application/useCases/findExerciseByAccount.ts";
import { ExerciseRepository } from "../application/repositories/exerciseRepository.ts";
import { AccountRepository } from "../application/repositories/accountRepository.ts";
import { AccountId, GymBud } from "../domain/Account.ts";
import { Exercise } from "../domain/Exercise.ts";
import {
  AccountNotFoundError,
  NoExercisesFoundError,
} from "../application/applicationErrors.ts";

describe("FindExerciseByAccountIdService", () => {
  let mockExerciseRepository: jest.Mocked<ExerciseRepository>;
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  let service: FindExerciseByAccountIdService;

  beforeEach(() => {
    mockExerciseRepository = {
      findByAccount: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      store: jest.fn(),
      findByProperty: jest.fn(),
    };
    mockAccountRepository = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
      store: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findByProperty: jest.fn(),
    };
    service = new FindExerciseByAccountIdService(
      mockExerciseRepository,
      mockAccountRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns exercises if account and exercises exist", async () => {
    const id = AccountId.create().value;
    const accountId = AccountId.fromString(id);
    const gymbud = {} as GymBud;
    const exercises = [{} as Exercise, {} as Exercise];

    mockAccountRepository.findById.mockResolvedValue(gymbud);
    mockExerciseRepository.findByAccount.mockResolvedValue(exercises);

    const result = await service.execute(id);

    expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(mockExerciseRepository.findByAccount).toHaveBeenCalledWith(gymbud);
    expect(result).toBe(exercises);
  });

  it("throws AccountNotFoundError if account does not exist", async () => {
    const id = AccountId.create().value;
    const accountId = AccountId.fromString(id);

    mockAccountRepository.findById.mockResolvedValue(null);

    await expect(service.execute(id)).rejects.toThrow(AccountNotFoundError);
    expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(mockExerciseRepository.findByAccount).not.toHaveBeenCalled();
  });

  it("throws NoExercisesFoundError if no exercises are found", async () => {
    const id = AccountId.create().value;
    const accountId = AccountId.fromString(id);
    const gymbud = {} as GymBud;

    mockAccountRepository.findById.mockResolvedValue(gymbud);
    mockExerciseRepository.findByAccount.mockResolvedValue(null);

    await expect(service.execute(id)).rejects.toThrow(NoExercisesFoundError);
    expect(mockAccountRepository.findById).toHaveBeenCalledWith(accountId);
    expect(mockExerciseRepository.findByAccount).toHaveBeenCalledWith(gymbud);
  });
});
