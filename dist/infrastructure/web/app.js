import express from "express";
import cors from "cors";
import { apiRoutes } from "./routes/api.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { NotFoundError } from "./HTTPErrors.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);
// Catch all invalid routes
app.use((req, res, next) => {
    next(new NotFoundError("Route not found"));
});
app.use(errorHandler);
// Export the app instance for testing
export { app };
