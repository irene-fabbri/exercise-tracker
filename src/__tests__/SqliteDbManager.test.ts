import { SqliteDbManager } from "../infrastructure/database/SqliteDbManager.ts";
import sqlite3 from "sqlite3";
import { jest } from "@jest/globals";
import {
  DatabaseConfigError,
  DatabaseInitializationError,
} from "../infrastructure/database/databaseErrors.ts";

// Mock sqlite3.Database
jest.unstable_mockModule("sqlite3", () => {
  class MockDatabase {
    close = jest.fn(
      (callback?: (err: Error | null) => void) => callback && callback(null)
    );
    constructor(
      _path: string,
      _mode: number,
      callback?: (err: Error | null) => void
    ) {
      if (callback) callback(null);
    }
  }
  return {
    verbose: jest.fn(),
    Database: MockDatabase,
    OPEN_READWRITE: 1,
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("SqliteDbManager", () => {
  const config = { type: "sqlite", path: ":memory:" } as any;

  it("initializes the database successfully", async () => {
    const manager = new SqliteDbManager(config);
    const db = await manager.initializeDatabase();
    expect(db).toBeDefined();
  });

  it("throws DatabaseConfigError if config type is not sqlite", async () => {
    const badConfig = { type: "mongo", path: ":memory:" } as any;
    const manager = new SqliteDbManager(badConfig);
    await expect(manager.initializeDatabase()).rejects.toThrow(
      DatabaseConfigError
    );
  });

  it("returns the same database instance if already initialized", async () => {
    const manager = new SqliteDbManager(config);
    const db1 = await manager.initializeDatabase();
    const db2 = await manager.initializeDatabase();
    expect(db1).toBe(db2);
  });

  it("closes the database successfully", async () => {
    const manager = new SqliteDbManager(config);
    await manager.initializeDatabase();
    await expect(manager.closeDatabase()).resolves.toBeUndefined();
  });

  it("logs if database is already closed", async () => {
    const manager = new SqliteDbManager(config);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await manager.closeDatabase();
    expect(logSpy).toHaveBeenCalledWith(
      "Database connection is closed already"
    );
    logSpy.mockRestore();
  });
});
