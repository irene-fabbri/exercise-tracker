import {
  DatabaseAccessError,
  DatabaseConfigError,
} from "../infrastructure/database/databaseErrors.ts";

export type SqliteConfig = {
  type: "sqlite";
  path: string;
};

export type MongoDbConfig = {
  type: "mongodb";
  uri: string;
  databaseName: string;
};

export interface Config {
  database: SqliteConfig | MongoDbConfig;
}

type DbType = "sqlite" | "mongodb";
type ConfigurationLoader = () => Config;
const configurationLoader = new Map<DbType, ConfigurationLoader>([
  [
    "sqlite",
    () => {
      const path = process.env.SQLITE_DB_PATH;
      if (!path) {
        throw new DatabaseAccessError(
          "Missing SQLITE_DB_PATH for sqlite config"
        );
      }
      return {
        database: {
          type: "sqlite",
          path,
        },
      };
    },
  ],
  [
    "mongodb",
    () => {
      const uri = process.env.MONGODB_CONNECTION_STRING;
      if (!uri) {
        throw new DatabaseAccessError("Missing DB_CONNECTION_STRING .env file");
      }

      const databaseName = process.env.MONGODB_DB_NAME;
      if (!databaseName) {
        throw new DatabaseAccessError("Missing DB_NAME in .env file");
      }
      return {
        database: {
          type: "mongodb",
          uri,
          databaseName,
        },
      };
    },
  ],
]);

function configurationLoaderFactory(dbType: DbType): ConfigurationLoader {
  if (!configurationLoader.has(dbType)) {
    throw new DatabaseConfigError(`Unsupported DB_TYPE: ${dbType}`);
  }

  return configurationLoader.get(dbType) as ConfigurationLoader;
}

export function loadConfig(dbType: DbType): Config {
  // STRATEGY PATTERN: prendi appunti
  const loader = configurationLoaderFactory(dbType);
  return loader();
}
