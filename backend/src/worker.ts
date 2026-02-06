import { Worker } from "bullmq";
import { redisConnection } from "./queue";
import { db } from "./db";
import nodemailer from "nodemailer";
import { checkRateLimit } from "./rateLimiter";


new Worker(
  "emails",
  async (job) => {
    const { id } = job.data;

    const result = await db.query(
      "SELECT * FROM emails WHERE id=$1",
      [id]
    );

    const email = result.rows[0];
    if (!email || email.status === "sent") return;

    try {
      await checkRateLimit();

      const test = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: test.smtp.host,
        port: test.smtp.port,
        secure: test.smtp.secure,
        auth: {
          user: test.user,
          pass: test.pass,
        },
      });

      await transporter.sendMail({
        from: '"ReachInbox" <no-reply@reachinbox.ai>',
        to: email.email,
        subject: email.subject,
        text: email.body,
      });

      await db.query(
        "UPDATE emails SET status='sent' WHERE id=$1",
        [id]
      );

      console.log("Email sent:", email.email);
    } catch (err: any) {
      await job.moveToDelayed(Number(err.message) - Date.now());
    }
  },
  {
    concurrency: 5,
    connection: redisConnection,
  }
);
