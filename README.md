# Floww - AI-Powered Personal Finance Tracker

> Smart money management, powered by AI.

**Live Demo:** [https://floww-nu.vercel.app](https://floww-nu.vercel.app)

---

## Overview

Floww is a full-stack personal finance management web application built with Next.js 15. It allows users to track income and expenses, manage multiple accounts, set monthly budgets, and get AI-powered receipt scanning - all behind secure authentication.

---

## Features

- **Authentication** - Secure sign-up/sign-in via Clerk
- **Dashboard** - Overview of accounts, balances, and recent transactions
- **Transaction Management** - Add, categorize, and filter income/expense transactions
- **Recurring Transactions** - Schedule daily, weekly, monthly, or yearly transactions
- **Budget Tracking** - Set monthly budgets with automated email alerts when limits are approached
- **AI Receipt Scanning** - Upload a receipt image and auto-fill transaction details using Gemini AI
- **Multiple Accounts** - Support for current and savings accounts with a default account setting
- **Email Notifications** - Automated budget alert emails via Resend
- **Bot Protection** - Arcjet-powered shield and bot detection on API routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Auth | Clerk |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| AI | Google Gemini, Groq |
| Email | Resend + React Email |
| Background Jobs | Inngest |
| Security | Arcjet |
| Deployment | Vercel |

---

## Getting Started (Local Setup)

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (PostgreSQL)
- A [Clerk](https://clerk.com) application
- A [Groq](https://console.groq.com) API key
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- A [Resend](https://resend.com) API key
- An [Arcjet](https://arcjet.com) API key
- An [Inngest](https://inngest.com) account (for background jobs)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/floww.git
cd floww
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```properties
# Database (Supabase)
DATABASE_URL="postgresql://postgres:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@db.xxxx.supabase.co:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL=/dashboard

# AI
GEMINI_API_KEY="your_gemini_api_key"
GROQ_API_KEY="your_groq_api_key"

# Email
RESEND_API_KEY="re_..."

# Security
ARCJET_KEY="ajkey_..."
```

### 4. Set up the database

```bash
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables from your `.env.local` in Vercel → Settings → Environment Variables
4. Deploy

Every subsequent `git push` to `main` will trigger an automatic redeployment.

---

## Project Structure

```
floww/
├── app/
│   ├── (auth)/         # Sign-in and sign-up pages
│   ├── (main)/         # Dashboard, account, transaction pages
│   └── api/            # API routes (Inngest, seed)
├── actions/            # Server actions (transactions, accounts, budget)
├── components/         # Shared UI components
├── emails/             # React Email templates
├── lib/                # Prisma client, utilities
├── prisma/             # Database schema and migrations
└── middleware.js       # Clerk auth middleware
```

---

## License

This project is for academic and personal use.
