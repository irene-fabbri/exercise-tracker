import sqlite3 from "sqlite3";
import { SqliteExerciseRepository } from "../infrastructure/repositories/SqliteExerciseRepository.ts";
import { GymBud, AccountId } from "../domain/Account.ts";
import { Exercise, ExerciseId } from "../domain/Exercise.ts";
import { Description } from "../domain/Description.ts";
import { Duration } from "../domain/Duration.ts";
import { ExerciseDate } from "../domain/ExerciseDate.ts";

describe("SqliteExerciseRepository", () => {
  let db: sqlite3.Database;
  let repo: SqliteExerciseRepository;
  let gymbud: GymBud;

  beforeAll((done) => {
    db = new sqlite3.Database(":memory:", (err) => {
      if (err) return done(err);
      db.run(
        `CREATE TABLE exercises (
          id TEXT PRIMARY KEY,
          description TEXT NOT NULL,
          duration INTEGER NOT NULL,
          date TEXT NOT NULL,
          userId TEXT NOT NULL
        );`,
        (err) => {
          if (err) return done(err);
          repo = new SqliteExerciseRepository(db);
          gymbud = new GymBud(AccountId.create(), { value: "testuser" } as any);
          done();
        }
      );
    });
  });

  afterAll((done) => {
    db.close(done);
  });

  it("creates and finds exercises by account", async () => {
    const exercise = new Exercise(
      ExerciseId.create(),
      new Description("Push-ups"),
      new Duration(30),
      gymbud,
      ExerciseDate.fromString("2024-07-08")
    );

    await repo.create(exercise);

    const found = await repo.findByAccount(gymbud);
    expect(found).not.toBeNull();
    expect(found?.length).toBe(1);
    expect(found?.[0].description.value).toBe("Push-ups");
    expect(found?.[0].gymbud.id.value).toBe(gymbud.id.value);
  });

  it("returns null if no exercises for account", async () => {
    const otherGymbud = new GymBud(AccountId.create(), {
      value: "otheruser",
    } as any);
    const found = await repo.findByAccount(otherGymbud);
    expect(found).toBeNull();
  });
});
