import { redis } from "./queue";

const MAX_EMAILS_PER_HOUR = 100;

export async function checkRateLimit() {
  const hourKey = new Date().toISOString().slice(0, 13);
  const key = `email_rate:${hourKey}`;

  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 3600);
  }

  if (count > MAX_EMAILS_PER_HOUR) {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    throw new Error(nextHour.getTime().toString());
  }
}
