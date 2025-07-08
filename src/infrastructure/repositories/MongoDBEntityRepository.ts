import { Entity } from "../../domain/Entity.ts";
import { Identifier } from "../../domain/Identifier.ts";
import {
  DatabaseCreateError,
  DatabaseDeleteError,
  DatabaseReadError,
} from "../database/databaseErrors.ts";
import { EntityRepository } from "../../application/repositories/EntityRepository.ts";
import { Db, Collection, Document, WithId, Binary } from "mongodb";

export abstract class MongoDbEntityRepository<T extends Entity>
  implements EntityRepository<T>
{
  constructor(protected readonly db: Db) {}

  protected abstract getCollection(): Collection;
  protected abstract mapToEntity(
    document: WithId<Document>,
    context?: Partial<T>
  ): T;

  protected abstract mapFromEntity(entity: T): Document;
  protected abstract allowedColumns(): string[];

  static convertUuidToBinary(uuid: string): Binary {
    // Remove dashes and convert hex string to Buffer
    const buffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
    return new Binary(buffer, Binary.SUBTYPE_UUID);
  }

  async store(entity: T): Promise<void> {
    let obj: Document = {
      _id: MongoDbEntityRepository.convertUuidToBinary(entity.id.value),
      ...this.mapFromEntity(entity),
    };
    console.log("Storing object:", obj);
    try {
      const collection = this.getCollection();
      await collection.updateOne(
        { _id: obj._id },
        { $set: obj },
        { upsert: true }
      );
    } catch (error) {
      console.error("Error creating or updating object:", error);
      throw new DatabaseCreateError(
        `Error creating or updating object: ${error}`
      );
    }
  }

  async delete(entity: T): Promise<void> {
    try {
      const collection = this.getCollection();
      const binaryUUID = MongoDbEntityRepository.convertUuidToBinary(
        entity.id.value
      );
      const result = await collection.deleteOne({ _id: binaryUUID });
      if (!result || !result.deletedCount) {
        throw new DatabaseDeleteError(entity.id.value);
      }
    } catch (error) {
      throw new DatabaseDeleteError(entity.id.value);
    }
  }

  async findById(id: Identifier, context?: Partial<T>): Promise<T | null> {
    try {
      const collection = this.getCollection();
      const binaryUUID = MongoDbEntityRepository.convertUuidToBinary(id.value);
      const result = await collection.findOne({ _id: binaryUUID });
      if (!result) {
        return null;
      }

      return this.mapToEntity(result, context);
    } catch (error) {
      throw new DatabaseReadError(
        `Error looking for the object with id: ${id.value}`
      );
    }
  }

  async findByProperty<Value>(
    key: string,
    value: Value,
    context?: Partial<T>
  ): Promise<T[] | null> {
    if (!this.allowedColumns().includes(key)) {
      throw new DatabaseReadError(`Invalid key name: ${key}`);
    }
    try {
      const collection = this.getCollection();
      const result = await collection.find({ [key]: value }).toArray();
      if (!result) {
        return null;
      }

      return result.map((document) => this.mapToEntity(document, context));
    } catch (error) {
      throw new DatabaseReadError(
        `Error looking for the object with key: ${key} and value ${value}`
      );
    }
  }

  async findAll(context?: Partial<T>): Promise<T[] | null> {
    try {
      const collection = this.getCollection();
      const result = await collection.find({}).toArray();
      if (result.length === 0) {
        return null;
      }
      const entityList = result.map((document) =>
        this.mapToEntity(document, context)
      );
      return entityList;
    } catch (error) {
      throw new DatabaseReadError("Error retrieving users");
    }
  }
}
