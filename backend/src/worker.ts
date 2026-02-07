import { Worker } from "bullmq";
import IORedis from "ioredis";

const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing job:", job.data);
  },
  {
    connection: redisConnection,
  }
);
import { Worker } from "bullmq";
import IORedis from "ioredis";

const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing job:", job.data);
  },
  {
    connection: redisConnection,
  }
);
