import sqlite3 from "sqlite3";
sqlite3.verbose();
import { EntityRepository } from "../../application/repositories/EntityRepository.ts";
import { Entity } from "../../domain/Entity.ts";
import { Identifier } from "../../domain/Identifier.ts";
import {
  DatabaseCreateError,
  DatabaseDeleteError,
  DatabaseReadError,
} from "../database/databaseErrors.ts";

export abstract class SqliteEntityRepository<T extends Entity>
  implements EntityRepository<T>
{
  constructor(protected readonly db: sqlite3.Database) {}
  protected abstract getTableName(): string;
  protected abstract mapFromEntity(entity: T): Record<string, unknown>;
  protected abstract allowedColumns(): string[];

  protected abstract mapToEntity(
    row: Record<string, unknown>,
    context?: Partial<T>
  ): T;

  async store(entity: T): Promise<void> {
    const table = this.getTableName();
    const allowed = this.allowedColumns();
    const rawData = this.mapFromEntity(entity);
    const data = Object.fromEntries(
      Object.entries(rawData).filter(([key]) => allowed.includes(key))
    );

    const columns = allowed.join(", ");
    const placeholders = allowed.map(() => "?").join(", ");
    const values = allowed.map((col) => data[col]);

    const sql = `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`;

    return new Promise((resolve, reject) => {
      this.db.run(sql, values, function (error) {
        if (error) {
          console.error(`Error running ${sql}`, error);
          return reject(
            new DatabaseCreateError(
              `Failed to perform ${sql}: ${error.message}`
            )
          );
        }
        resolve();
      });
    });
  }

  async delete(entity: T): Promise<void> {
    const sql = `DELETE FROM ${this.getTableName()} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [entity.id.value], function (error) {
        if (error) {
          console.error(`Error running ${sql}`, error);
          return reject(
            new DatabaseDeleteError(
              `Failed to perform ${sql}: ${error.message}`
            )
          );
        }
        resolve();
      });
    });
  }

  async findById(
    id: Identifier,
    context?: Partial<T> | undefined
  ): Promise<T | null> {
    const sql = `SELECT * FROM ${this.getTableName()} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(
        sql,
        [id.value],
        (error: Error, row: Record<string, unknown>) => {
          if (error) {
            console.error(`Error running ${sql}`, error);
            return reject(
              new DatabaseReadError(
                `Failed to perform ${sql}: ${error.message}`
              )
            );
          }
          if (!row) {
            return resolve(null);
          }
          const entity = this.mapToEntity(row, context);
          resolve(entity);
        }
      );
    });
  }

  async findAll(context?: Partial<T>): Promise<T[] | null> {
    const sql = `SELECT * FROM ${this.getTableName()}`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (error: Error, rows: Record<string, unknown>[]) => {
        if (error) {
          console.error(`Error running ${sql}`, error);
          return reject(
            new DatabaseReadError(`Failed to perform ${sql}: ${error.message}`)
          );
        }
        if (rows.length === 0) {
          return resolve(null);
        }

        const entityList = rows.map((row) => this.mapToEntity(row, context));

        resolve(entityList);
      });
    });
  }

  async findByProperty<Value>(
    key: string,
    value: Value,
    context?: Partial<T>
  ): Promise<T[] | null> {
    if (!this.allowedColumns().includes(key)) {
      throw new Error(`Invalid column name: ${key}`);
    }

    const sql = `SELECT * FROM ${this.getTableName()} WHERE ${key}=?`;
    return new Promise((resolve, reject) => {
      this.db.all(
        sql,
        [value],
        (error: Error, rows: Record<string, unknown>[]) => {
          if (error) {
            console.error(`Error running ${sql}`, error);
            return reject(
              new DatabaseReadError(
                `Failed to perform ${sql}: ${error.message}`
              )
            );
          }
          if (rows.length === 0) {
            return resolve(null);
          }

          const entityList = rows.map((row) => this.mapToEntity(row, context));

          resolve(entityList);
        }
      );
    });
  }
}
