import { Collection, Document, WithId } from "mongodb";
import { Account, AccountId, GymBud } from "../../domain/Account.ts";
import { MongoDbEntityRepository } from "./MongoDBEntityRepository.ts";
import { AccountRepository } from "../../application/repositories/accountRepository.ts";
import { Username } from "../../domain/Username.ts";
import { DatabaseReadError } from "../database/databaseErrors.ts";

export class MongoDbAccountRepository
  extends MongoDbEntityRepository<Account>
  implements AccountRepository
{
  protected allowedColumns(): string[] {
    return ["_id", "username"];
  }
  protected getCollection(): Collection {
    return this.db.collection("users");
  }
  protected mapToEntity(document: WithId<Document>): GymBud {
    if ("username" in document && typeof document.username === "string") {
      try {
        const account = new GymBud(
          AccountId.fromString(document._id.toHexString()),
          new Username(document.username)
        );
        return account;
      } catch (error) {
        throw new DatabaseReadError(
          `Error parsing the object with id: ${document._id} to a account object`
        );
      }
    }
    throw new DatabaseReadError(
      `Invalid fields in document ${JSON.stringify(document)}`
    );
  }
  protected mapFromEntity(account: Account): Document {
    return {
      username: account.username.value,
    };
  }

  async create(account: GymBud): Promise<void> {
    return await this.store(account);
  }

  async findByUsername(username: Username): Promise<Account | null> {
    const result = await this.findByProperty("username", username.value);

    if (result?.length && result?.length > 1) {
      //TO ASK: it's a problem for the database structure, the app should still work
      console.error(`Too many users called ${username.value}`);
    }

    return result?.[0] ?? null;
  }
}
