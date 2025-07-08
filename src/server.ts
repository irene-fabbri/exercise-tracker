import dotenv from "dotenv";
import { loadConfig } from "./config/config.ts";
import { initializeDependencies } from "./config/dependencies.ts";
import { createApp } from "./infrastructure/web/app.ts";
import { createApiRoutes } from "./infrastructure/web/routes/api.ts";

const PORT: number = parseInt(process.env.PORT || "5000", 10);

async function startServer(): Promise<void> {
  try {
    dotenv.config();
    // Determine DB type, e.g., from environment variable or default
    const dbType = (process.env.DB_TYPE as "sqlite" | "mongodb") || "sqlite";
    // Load config for the chosen DB type
    const config = loadConfig(dbType);

    const { accountController, exerciseController } =
      await initializeDependencies(config);
    const apiRouter = createApiRoutes(accountController, exerciseController);
    const app = createApp(apiRouter);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
// the listening part is separated so that i can test app.js
