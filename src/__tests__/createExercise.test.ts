import { jest } from "@jest/globals";
import { CreateExerciseService } from "../application/useCases/createExercise.js";
import { Exercise } from "../domain/Exercise.js";
import { AccountId, GymBud } from "../domain/Account.js";
import { AccountNotFoundError } from "../application/applicationErrors.js";
import { AccountRepository } from "../application/repositories/accountRepository.ts";
import { ExerciseRepository } from "../application/repositories/exerciseRepository.ts";

describe("CreateExerciseService", () => {
  let mockAccountRepository: jest.Mocked<AccountRepository>;
  let mockExerciseRepository: jest.Mocked<ExerciseRepository>;
  let service: CreateExerciseService;

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
    mockExerciseRepository = {
      findByAccount: jest.fn(),
      create: jest.fn(),
      store: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByProperty: jest.fn(),
    };
    service = new CreateExerciseService(
      mockExerciseRepository,
      mockAccountRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates a new exercise if user exists", async () => {
    const userId = AccountId.create().value;
    const gymbud = {} as GymBud;
    mockAccountRepository.findById.mockResolvedValue(gymbud);
    mockExerciseRepository.create.mockResolvedValue();

    // Mock Exercise.create to return a dummy exercise
    const exercise = {} as Exercise;
    const createSpy = jest.spyOn(Exercise, "create").mockReturnValue(exercise);

    const result = await service.execute("run", 30, "2024-01-01", userId);

    expect(mockAccountRepository.findById).toHaveBeenCalledWith(
      AccountId.fromString(userId)
    );
    expect(createSpy).toHaveBeenCalledWith("run", 30, gymbud, "2024-01-01");
    expect(mockExerciseRepository.create).toHaveBeenCalledWith(exercise);
    expect(result).toBe(exercise);

    createSpy.mockRestore();
  });

  it("throws AccountNotFoundError if user does not exist", async () => {
    const userId = AccountId.create().value;
    mockAccountRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute("run", 30, "2024-01-01", userId)
    ).rejects.toThrow(AccountNotFoundError);

    expect(mockExerciseRepository.create).not.toHaveBeenCalled();
  });
});
