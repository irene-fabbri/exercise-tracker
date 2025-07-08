import { jest } from "@jest/globals";

// Mock MongoClient and Db
const mockConnect = jest.fn();
const mockClose = jest.fn();
const mockDb = jest.fn().mockReturnValue({});

jest.unstable_mockModule("mongodb", () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    close: mockClose,
    db: mockDb,
  })),
}));

const { MongoDbManager } = await import(
  "../infrastructure/database/MongoDbManager.ts"
);
import {
  DatabaseAccessError,
  DatabaseError,
} from "../infrastructure/database/databaseErrors.ts";
const config = {
  uri: "mongodb://localhost:27017",
  databaseName: "testdb",
} as any;

describe("MongoDbManager", () => {
  beforeEach(() => {
    mockConnect.mockClear();
    mockClose.mockClear();
    mockDb.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("initializes the database successfully", async () => {
    const manager = new MongoDbManager(config);
    await expect(manager.initializeDatabase()).resolves.toBeDefined();
    expect(mockConnect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith("testdb");
  });

  it("returns the same database instance if already initialized", async () => {
    const manager = new MongoDbManager(config);
    const db1 = await manager.initializeDatabase();
    const db2 = await manager.initializeDatabase();
    expect(db1).toBe(db2);
  });

  it("throws DatabaseAccessError if connection fails", async () => {
    mockConnect.mockImplementationOnce(() => {
      throw new Error("fail");
    });
    const manager = new MongoDbManager(config);
    await expect(manager.initializeDatabase()).rejects.toThrow(
      DatabaseAccessError
    );
  });

  it("closes the database successfully", async () => {
    const manager = new MongoDbManager(config);
    await manager.initializeDatabase();
    await expect(manager.closeDatabase()).resolves.toBeUndefined();
    expect(mockClose).toHaveBeenCalled();
  });

  it("throws DatabaseError if closing fails", async () => {
    mockClose.mockImplementationOnce(() => {
      throw new Error("fail");
    });
    const manager = new MongoDbManager(config);
    await manager.initializeDatabase();
    await expect(manager.closeDatabase()).rejects.toThrow(DatabaseError);
  });

  it("logs if database is already closed", async () => {
    const manager = new MongoDbManager(config);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await manager.closeDatabase();
    expect(logSpy).toHaveBeenCalledWith(
      "Database connection is closed already"
    );
    logSpy.mockRestore();
  });
});
