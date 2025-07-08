import sqlite3 from "sqlite3";
import { SqliteAccountRepository } from "../infrastructure/repositories/SqliteAccountRepository.ts";
import { GymBud, AccountId } from "../domain/Account.ts";
import { Username } from "../domain/Username.ts";

describe("SqliteAccountRepository", () => {
  let db: sqlite3.Database;
  let repo: SqliteAccountRepository;

  beforeAll((done) => {
    db = new sqlite3.Database(":memory:", (err) => {
      if (err) return done(err);
      db.run(
        `CREATE TABLE users (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL
        );`,
        (err) => {
          if (err) return done(err);
          repo = new SqliteAccountRepository(db);
          done();
        }
      );
    });
  });

  afterAll((done) => {
    db.close(done);
  });

  it("creates and finds an account by username", async () => {
    const username = new Username("testuser");
    const account = new GymBud(AccountId.create(), username);

    await repo.create(account);

    const found = await repo.findByUsername(username);
    expect(found).not.toBeNull();
    expect(found?.id.value).toBe(account.id.value);
    expect(found?.username.value).toBe(account.username.value);
  });

  it("returns null if username does not exist", async () => {
    const username = new Username("nouser");
    const found = await repo.findByUsername(username);
    expect(found).toBeNull();
  });
});
