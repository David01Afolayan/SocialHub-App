# SocialHub

SocialHub is a full-stack social networking platform built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- Authentication with credentials and Google OAuth
- Profiles, usernames, bios, and avatars
- Posts, likes, comments, bookmarks, and follows
- Notifications and direct messaging primitives
- Search, scheduling, analytics, and admin moderation
- Database-backed role-based authorization
- Pusher real-time event architecture

## Tech stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Prisma, PostgreSQL, NextAuth
- **Real-time:** Pusher

## Architecture

```text
Browser -> Next.js UI -> API routes -> Prisma -> PostgreSQL
                              |
                              -> Pusher temporary events
```

PostgreSQL remains the source of truth. Pusher delivers transient updates such as messages and notifications.

## Local development

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Copy `.env.example` to `.env.local` and provide the required credentials. Do not commit `.env` or `.env.local`.

To create deterministic demo data:

```bash
npm run seed
```

The seeded demo account is `demo@socialhub.dev` with password `DemoPassword123!`.

## Validation

```bash
npx prisma validate
npx tsc --noEmit
npm run build
```

## Deployment

Set the variables from `.env.example` in the deployment provider. Configure the Google OAuth callback to:

`https://<your-domain>/api/auth/callback/google`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

For Google sign-in on the production deployment, set `AUTH_URL` to the public app URL and add this exact Google OAuth redirect URI:

`https://social-hub-app.vercel.app/api/auth/callback/google`

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
