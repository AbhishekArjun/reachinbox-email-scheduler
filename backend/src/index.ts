import express from "express";
import { emailQueue } from "./queue";
import { db } from "./db";

const app = express();
app.use(express.json());

app.post("/schedule", async (req, res) => {
  const { email, subject, body, sendAt } = req.body;

  const result = await db.query(
    "INSERT INTO emails(email,subject,body,send_at) VALUES($1,$2,$3,$4) RETURNING id",
    [email, subject, body, sendAt]
  );

  await emailQueue.add(
    "send",
    { id: result.rows[0].id },
    { delay: new Date(sendAt).getTime() - Date.now() }
  );

  res.json({ success: true });
});

app.get("/emails", async (_, res) => {
  const result = await db.query("SELECT * FROM emails");
  res.json(result.rows);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
