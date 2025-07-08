import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { MongoDbAccountRepository } from "../infrastructure/repositories/MongoDbAccountRepository.ts";
import { GymBud, AccountId } from "../domain/Account.ts";
import { Username } from "../domain/Username.ts";

describe("MongoDbAccountRepository", () => {
  let mongod: MongoMemoryServer;
  let client: MongoClient;
  let db: any;
  let repo: MongoDbAccountRepository;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    client = await MongoClient.connect(mongod.getUri(), {});
    db = client.db("testdb");
    repo = new MongoDbAccountRepository(db);
  });

  afterAll(async () => {
    await client.close();
    await mongod.stop();
  });

  it("creates and finds an account by username", async () => {
    const username = new Username("testuser");
    const account = new GymBud(AccountId.create(), username);

    await repo.create(account);

    const found = await repo.findByUsername(username);
    expect(found).not.toBeNull();
    expect(found?.username.value).toBe(username.value);
    expect(found?.id.value).toBe(account.id.value);
  });

  it("returns null if username does not exist", async () => {
    const username = new Username("nouser");
    const found = await repo.findByUsername(username);
    expect(found).toBeNull();
  });

  it("finds all accounts", async () => {
    const accounts = await repo.findAll();
    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts).not.toBeNull();
    expect(accounts!.length).toBeGreaterThan(0);
  });
});
