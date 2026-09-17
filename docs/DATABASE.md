# Database

Prisma models cover users, posts, comments, follows, bookmarks, hashtags,
mentions, conversations, messages, reactions, notifications, search history,
interests, moderation, and devices.

Use additive migrations for schema changes:

```bash
npm run db:format
npm run db:validate
npm run db:deploy
```

Do not use `prisma db push` against production.
