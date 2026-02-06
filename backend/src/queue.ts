import { Queue } from "bullmq";
import IORedis from "ioredis";

// ✅ Dedicated Redis client (for rate limiting, counters, etc.)
export const redis = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

// ✅ Connection config for BullMQ (IMPORTANT)
export const redisConnection = {
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
};

// Queue
export const emailQueue = new Queue("emails", {
  connection: redisConnection,
});
