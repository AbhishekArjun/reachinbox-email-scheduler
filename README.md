📧 ReachInbox – Full-Stack Email Job Scheduler

A production-grade email scheduling system built using TypeScript, Express, BullMQ, Redis, PostgreSQL, and Next.js.

This project demonstrates reliable delayed email scheduling, persistence across restarts, rate limiting, concurrency control, and a Google OAuth-enabled dashboard.

🚀 Features
✅ Backend

Email scheduling via REST API

Persistent job queue using BullMQ + Redis

PostgreSQL for durable storage

Ethereal SMTP for email testing

Survives server restarts

Idempotent job handling

Configurable:

Worker concurrency

Delay between sends

Hourly rate limit

Redis-backed rate limiting (safe across multiple workers)

✅ Frontend

Next.js + TypeScript

Google OAuth login (NextAuth)

Dashboard:

Scheduled Emails

Sent Emails

Compose email with:

Subject

Body

CSV upload

Start time

Delay between emails

Hourly limit

Loading states & empty states

Clean reusable UI components

🏗 Architecture Overview
Scheduling Flow

Frontend sends scheduling request

Backend:

Stores email in PostgreSQL

Calculates delay (sendAt - now)

Adds delayed job to BullMQ queue

Worker:

Picks job when delay expires

Checks Redis rate limiter

Sends email via Ethereal

Updates DB status

🔁 Persistence on Restart

BullMQ stores delayed jobs in Redis

PostgreSQL stores email state

If server restarts:

Redis still contains delayed jobs

Worker resumes automatically

No duplicate sends (idempotent handling)

⚙️ Concurrency

Worker configured with:

new Worker("emailQueue", processor, {
  concurrency: WORKER_CONCURRENCY
})


Value configurable via .env.

⏳ Delay Between Emails

Implemented using:

BullMQ processing control
OR

Artificial await sleep() in worker

Current configuration:

MIN_DELAY_BETWEEN_EMAILS = 2000ms (2 seconds)

📊 Hourly Rate Limiting

Redis-backed counter:

Key format:

rate_limit:<sender>:<YYYY-MM-DD-HH>


Logic:

Increment counter on each send

If exceeds MAX_EMAILS_PER_HOUR

Job is re-delayed to next hour

Not dropped

Order preserved

Safe across:

Multiple workers

Multiple server instances

🛠 Tech Stack
Backend

Node.js

Express.js

TypeScript

BullMQ

Redis

PostgreSQL

Nodemailer (Ethereal)

Frontend

Next.js 14

TypeScript

NextAuth

Tailwind CSS

Infra

Docker (Redis + Postgres)

🐳 Running the Project
1️⃣ Start Redis & Postgres
docker-compose up -d


Verify:

docker ps

2️⃣ Backend Setup
cd backend
npm install
npm run dev


In separate terminal:

npm run worker


Backend runs at:

http://localhost:4000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:3000

🔐 Google OAuth Setup

In Google Cloud Console:

Authorized JavaScript Origins:
http://localhost:3000

Authorized Redirect URI:
http://localhost:3000/api/auth/callback/google

frontend/.env.local
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000


Restart frontend after changes.

📬 Ethereal Email Setup

Worker creates test account automatically OR use:

nodemailer.createTestAccount()


Preview URL logged in console.

📡 API Endpoints
Schedule Email
POST /schedule


Body:

{
  "email": "test@example.com",
  "subject": "Hello",
  "body": "Test email",
  "sendAt": "2026-02-06T19:30:00"
}

📦 Behavior Under Load
Scenario: 1000 Emails Scheduled Same Time

All jobs added as delayed jobs

Worker processes with controlled concurrency

Rate limiter ensures:

Only allowed emails per hour

Excess jobs delayed to next window

No job dropped

Order preserved

🧪 Restart Test

Schedule future email

Stop backend

Restart backend

Worker resumes

Email sends correctly

📁 Project Structure
ReachInbox/
 ├── backend/
 │   ├── src/
 │   ├── worker.ts
 │   ├── rateLimiter.ts
 │   └── queue.ts
 ├── frontend/
 │   ├── pages/
 │   ├── api/auth/
 │   └── components/
 └── docker-compose.yml


📌 Assumptions & Trade-offs

Basic UI validation

Single-tenant rate limiting

Simple CSV parsing

No production email provider used (Ethereal only)

🎯 What This Demonstrates

Real-world queue design

Distributed-safe rate limiting

Persistent job scheduling

Production-ready backend architecture

Clean frontend integration

👨‍💻 Author

Abhishek Arjun
B.Tech IT
AWS & Full-Stack Enthusiast
