import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { MongoDbExerciseRepository } from "../infrastructure/repositories/MongoDbExerciseRepository.ts";
import { Exercise, ExerciseId } from "../domain/Exercise.ts";
import { GymBud, AccountId } from "../domain/Account.ts";
import { Description } from "../domain/Description.ts";
import { Duration } from "../domain/Duration.ts";
import { ExerciseDate } from "../domain/ExerciseDate.ts";

describe("MongoDbExerciseRepository", () => {
  let mongod: MongoMemoryServer;
  let client: MongoClient;
  let db: any;
  let repo: MongoDbExerciseRepository;
  let gymbud: GymBud;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    client = await MongoClient.connect(mongod.getUri(), {});
    db = client.db("testdb");
    repo = new MongoDbExerciseRepository(db);
    gymbud = new GymBud(AccountId.create(), { value: "testuser" } as any);
  });

  afterAll(async () => {
    await client.close();
    await mongod.stop();
  });

  it("creates and finds an exercise by id", async () => {
    const exercise = new Exercise(
      ExerciseId.create(),
      new Description("Push-ups"),
      new Duration(30),
      gymbud,
      ExerciseDate.fromString("2024-07-08")
    );

    await repo.create(exercise);

    const found = await repo.findById(exercise.id, { gymbud });
    expect(found).not.toBeNull();
    expect(found?.description.value).toBe("Push-ups");
    expect(found?.gymbud.id.value).toBe(gymbud.id.value);
  });

  it("returns null if exercise does not exist", async () => {
    const fakeId = ExerciseId.create();
    const found = await repo.findById(fakeId, { gymbud });
    expect(found).toBeNull();
  });

  it("finds all exercises", async () => {
    const exercises = await repo.findAll({ gymbud });
    expect(Array.isArray(exercises)).toBe(true);
    expect(exercises?.length).toBeGreaterThan(0);
  });
});
