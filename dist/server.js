import { initializeDependencies } from "./config/dependencies.js";
const PORT = parseInt(process.env.PORT || "5000", 10);
async function startServer() {
    try {
        await initializeDependencies();
        const { app } = await import("./infrastructure/web/app.js");
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
// the listening part is separated so that i can test app.js
