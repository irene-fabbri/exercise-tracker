import sqlite3 from "sqlite3";
import {
  DatabaseAccessError,
  DatabaseConfigError,
} from "../infrastructure/database/databaseErrors.ts";
import { MongoDbManager } from "../infrastructure/database/MongoDbManager.ts";
import { MongoDbAccountRepository } from "../infrastructure/repositories/MongoDbAccountRepository.ts";
import { MongoDbExerciseRepository } from "../infrastructure/repositories/MongoDbExerciseRepository.ts";
import { Db } from "mongodb";
import { DBManagerRepository } from "../application/repositories/dbManagerRepository.ts";
import { AccountRepository } from "../application/repositories/accountRepository.ts";
import { ExerciseRepository } from "../application/repositories/exerciseRepository.ts";
import { AccountController } from "../infrastructure/web/controllers/accountController.ts";
import { ExerciseController } from "../infrastructure/web/controllers/exerciseController.ts";
import { Config, MongoDbConfig } from "./config.ts";
import { SqliteDbManager } from "../infrastructure/database/SqliteDbManager.ts";
import { SqliteAccountRepository } from "../infrastructure/repositories/SqliteAccountRepository.ts";
import { SqliteExerciseRepository } from "../infrastructure/repositories/SqliteExerciseRepository.ts";
import { FindAllAccountsService } from "../application/useCases/findAllAccounts.ts";
import { FindAccountByIdService } from "../application/useCases/findAccountById.ts";
import { CreateAccountService } from "../application/useCases/createAccount.ts";
import { CreateExerciseService } from "../application/useCases/createExercise.ts";
import { FindExerciseByAccountIdService } from "../application/useCases/findExerciseByAccount.ts";
import { SqliteConfig } from "./configprova.ts";

interface Dependencies {
  accountRepository: AccountRepository;
  exerciseRepository: ExerciseRepository;
  accountController: AccountController;
  exerciseController: ExerciseController;
}

async function initializeDependencies(config: Config): Promise<Dependencies> {
  const { accountRepository, exerciseRepository } = await createRepositories(
    config
  );

  // Inject into use cases
  const findAllAccountsService = new FindAllAccountsService(accountRepository);
  const findAccountByIdService = new FindAccountByIdService(accountRepository);
  const createAccountService = new CreateAccountService(accountRepository);
  const createExerciseService = new CreateExerciseService(
    exerciseRepository,
    accountRepository
  );
  const findExerciseByAccountIdService = new FindExerciseByAccountIdService(
    exerciseRepository,
    accountRepository
  );

  // Inject into controllers
  const accountController = new AccountController(
    createAccountService,
    findAllAccountsService
  );

  const exerciseController = new ExerciseController(
    createExerciseService,
    findAccountByIdService,
    findExerciseByAccountIdService
  );
  return {
    accountRepository,
    exerciseRepository,
    accountController,
    exerciseController,
  };
}

interface RepositoryBundle {
  dbManager: DBManagerRepository<sqlite3.Database | Db>;
  accountRepository: AccountRepository;
  exerciseRepository: ExerciseRepository;
}

async function createRepositories(config: Config): Promise<RepositoryBundle> {
  let dbManager: DBManagerRepository<sqlite3.Database | Db>;
  let db: sqlite3.Database | Db;
  let accountRepository: AccountRepository;
  let exerciseRepository: ExerciseRepository;

  switch (config.database.type) {
    case "sqlite":
      dbManager = new SqliteDbManager(
        config.database as SqliteConfig
      ) as DBManagerRepository<sqlite3.Database>;

      //Initialize database
      await dbManager.initializeDatabase();
      db = dbManager.getDatabase() as sqlite3.Database;

      if (!db) throw new DatabaseAccessError("SQLite DB not initialized");
      accountRepository = new SqliteAccountRepository(db);
      exerciseRepository = new SqliteExerciseRepository(db);
      break;
    case "mongodb":
      dbManager = new MongoDbManager(
        config.database as MongoDbConfig
      ) as DBManagerRepository<Db>;
      await dbManager.initializeDatabase();
      db = dbManager.getDatabase() as Db;

      if (!db) throw new DatabaseAccessError("MongoDb DB not initialized");

      accountRepository = new MongoDbAccountRepository(db);
      exerciseRepository = new MongoDbExerciseRepository(db);
      break;
    default:
      throw new DatabaseConfigError(`Unsupported DB_TYPE: ${config.database}`);
  }
  return { dbManager, accountRepository, exerciseRepository };
}

export { initializeDependencies };
