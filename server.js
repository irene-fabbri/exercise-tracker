import { app } from "./infrastructure/web/app.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await import("./config/dependencies.js");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
// the listening part is separated so that i can test app.js
