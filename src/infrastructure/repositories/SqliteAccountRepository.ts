import { AccountId, GymBud } from "../../domain/Account.ts";
import { AccountRepository } from "../../application/repositories/accountRepository.ts";
import { DatabaseReadError } from "../database/databaseErrors.ts";
import { Username } from "../../domain/Username.ts";
import { SqliteEntityRepository } from "./SqliteEntityRepository.ts";
import { Account } from "../../domain/Account.ts";

export class SqliteAccountRepository
  extends SqliteEntityRepository<Account>
  implements AccountRepository
{
  protected allowedColumns(): string[] {
    return ["id", "username"];
  }

  protected getTableName(): string {
    return "users";
  }

  protected mapFromEntity(account: Account): Record<string, unknown> {
    return {
      id: account.id.value,
      username: account.username.value,
    };
  }

  private isAccountRow(
    row: Record<string, unknown>
  ): row is { id: string; username: string } {
    return typeof row.id === "string" && typeof row.username === "string";
  }
  protected mapToEntity(
    row: Record<string, unknown>,
    context?: Partial<Account> | undefined
  ): Account {
    if (this.isAccountRow(row)) {
      try {
        const account = new GymBud(
          AccountId.fromString(row.id),
          new Username(row.username)
        );
        return account;
      } catch (error) {
        throw new DatabaseReadError(
          `Error parsing the object with id: ${row.id} to a account object`
        );
      }
    }
    throw new DatabaseReadError(
      `Invalid fields in document ${JSON.stringify(row)}`
    );
  }

  async create(account: GymBud): Promise<void> {
    return await this.store(account);
  }

  async findByUsername(username: Username): Promise<GymBud | null> {
    const result = await this.findByProperty("username", username.value);

    if (result?.length && result?.length > 1) {
      //TO ASK: it's a problem for the database structure, the app should still work
      console.error(`Too many users called ${username.value}`);
    }

    return result?.[0] ?? null;
  }
}
