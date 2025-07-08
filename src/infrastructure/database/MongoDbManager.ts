import { MongoClient, Db } from "mongodb";
import { DatabaseAccessError, DatabaseError } from "./databaseErrors.ts";
import { DBManagerRepository } from "../../application/repositories/dbManagerRepository.ts";
import { MongoDbConfig } from "../../config/config.ts";

class MongoDbManager implements DBManagerRepository<Db> {
  private client: MongoClient | null = null;

  private database: Db | null = null;
  constructor(private config: MongoDbConfig) {}

  // Initialize the DB connection only once
  async initializeDatabase(): Promise<Db> {
    if (this.database) return this.database;

    try {
      this.client = new MongoClient(this.config.uri);
      await this.client.connect();
      this.database = this.client.db(this.config.databaseName);
      console.log("Connected to the MongoDb DB");
      return this.database;
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new DatabaseAccessError("Database connection failed");
    }
  }

  // get the connection
  getDatabase(): Db | null {
    return this.database;
  }

  async closeDatabase(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        console.log("MongoDB connection closed");
        this.client = null;
        this.database = null;
        return;
      } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        throw new DatabaseError("Error closing the database");
      }
    }
    console.log("Database connection is closed already");
  }
}

export { MongoDbManager };
