import express from "express";
import cors from "cors";

import { errorHandler } from "./middleware/errorHandler.js";
import { NotFoundError } from "./HTTPErrors.js";
export function createApp(apiRouter: express.Router) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  // Catch all invalid routes
  app.use((req, res, next) => {
    next(new NotFoundError("Route not found"));
  });

  app.use(errorHandler);

  return app;
}
