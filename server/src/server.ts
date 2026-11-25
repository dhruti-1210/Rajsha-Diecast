import "dotenv/config";

import { createServer } from "http";

import app from "./app";
import connectDB from "./config/database";
// import { insertAdminUser } from "./migrations/insertAdminUser";

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDB();
    // await main();
    const server = createServer(app);
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  }
}

void startServer();
