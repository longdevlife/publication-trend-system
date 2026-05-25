import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { connectMongo, disconnectMongo } from "./lib/db.js";
import { connectRedis, disconnectRedis } from "./lib/redis.js";
import { logger } from "./lib/logger.js";

async function main() {
  await connectMongo();
  await connectRedis();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "backend listening");
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "shutting down");
    server.close();
    await disconnectMongo();
    await disconnectRedis();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.fatal({ err }, "failed to start backend");
  process.exit(1);
});
