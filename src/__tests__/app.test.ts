import { jest } from "@jest/globals";
import request from "supertest";
import { createApiRoutes } from "../infrastructure/web/routes/api.ts";
import { createApp } from "../infrastructure/web/app.ts";
import { Request, Response } from "express";
import { ValidationError } from "../infrastructure/web/HTTPErrors.ts";
import { DatabaseReadError } from "../infrastructure/database/databaseErrors.ts";
import {
  AccountAlreadyExists,
  AccountNotFoundError,
} from "../application/applicationErrors.ts";
import { InvalidField } from "../domain/domainErrors.ts";

// Mock controllers
const mockAccountController = {
  findAllAccounts: jest.fn((req: Request, res: Response) =>
    res.json([{ id: 1, username: "test" }])
  ),
  createAccount: jest.fn((req: Request, res: Response) =>
    res.status(201).json({ id: 2, username: req.body.username })
  ),
};
const mockExerciseController = {
  createExercise: jest.fn((req: Request, res: Response) =>
    res.status(201).json({ userId: req.params.id, ...req.body })
  ),
  getLogs: jest.fn((req: Request, res: Response) =>
    res.json({ userId: req.params.id, logs: [] })
  ),
};

const apiRouter = createApiRoutes(
  mockAccountController as any,
  mockExerciseController as any
);

const app = createApp(apiRouter);
afterEach(() => {
  jest.clearAllMocks();
});

describe("API routes", () => {
  it("GET /api/users returns users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, username: "test" }]);
    expect(mockAccountController.findAllAccounts).toHaveBeenCalled();
  });

  it("POST /api/users creates a user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ username: "newuser" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, username: "newuser" });
    expect(mockAccountController.createAccount).toHaveBeenCalled();
  });

  it("POST /api/users/:id/exercises creates an exercise", async () => {
    const res = await request(app)
      .post("/api/users/123/exercises")
      .send({ description: "run", duration: 30 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      userId: "123",
      description: "run",
      duration: 30,
    });
    expect(mockExerciseController.createExercise).toHaveBeenCalled();
  });

  it("GET /api/users/:id/logs returns logs", async () => {
    const res = await request(app).get("/api/users/123/logs");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: "123", logs: [] });
    expect(mockExerciseController.getLogs).toHaveBeenCalled();
  });
  it("returns empty array if no users", async () => {
    mockAccountController.findAllAccounts.mockImplementationOnce((req, res) =>
      res.json([])
    );
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
  it("returns 400 for validation error", async () => {
    mockAccountController.createAccount.mockImplementationOnce(() => {
      throw new ValidationError("Username is required");
    });

    const res = await request(app).post("/api/users").send({});

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      code: "validation_error",
      title: "Username is required",
      detail: "Validation Error",
    });
  });

  it("returns 400 for InvalidField error", async () => {
    mockAccountController.createAccount.mockImplementationOnce(() => {
      throw new InvalidField("username is required");
    });

    const res = await request(app).post("/api/users").send({});

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      code: "invalid_field",
      title: "Invalid input",
      detail: "username is required",
      errors: { field: "username is required" },
    });
  });

  it("returns 404 for unknown route", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      code: "not_found",
      title: "Route not found",
      detail: "Not Found",
    });
  });

  it("returns 404 for AccountNotFoundError", async () => {
    const mockId = "123456";
    mockAccountController.findAllAccounts.mockImplementationOnce(() => {
      throw new AccountNotFoundError(mockId);
    });

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      code: "account_not_found",
      title: "Account not found",
      detail: `No Account matching the id '${mockId}'`,
    });
  });

  it("returns 409 for AccountAlreadyExists", async () => {
    const mockUsername = "Franco";
    mockAccountController.createAccount.mockImplementationOnce(() => {
      throw new AccountAlreadyExists(mockUsername);
    });

    const res = await request(app)
      .post("/api/users")
      .send({ username: "test" });

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({
      code: "account_conflict",
      title: "Account already exists",
      detail: `Account '${mockUsername}' already exists`,
    });
  });

  it("returns 500 for DatabaseReadError", async () => {
    mockAccountController.findAllAccounts.mockImplementationOnce(() => {
      throw new DatabaseReadError("Could not read DB");
    });

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({
      code: "db_read_error",
      title: "Database read error",
      detail: "Could not read DB",
    });
  });

  it("handles errors thrown by controller", async () => {
    mockAccountController.findAllAccounts.mockImplementationOnce(() => {
      throw new Error("Database down");
    });

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({
      code: "internal_error",
      title: "Internal Server Error",
      detail: "Database down",
    });
  });

  it("returns 404 for unsupported method", async () => {
    const res = await request(app).put("/api/users");
    expect(res.status).toBe(404);
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/api/users");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
