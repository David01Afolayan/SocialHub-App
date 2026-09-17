# Architecture

SocialHub uses the Next.js App Router as its web and API boundary.

```text
React components -> API clients -> versioned route handlers
                                  -> authentication and validation
                                  -> services
                                  -> repositories
                                  -> Prisma -> PostgreSQL
```

Redis provides cache, rate-limit, presence, and recommendation state. Pusher
delivers transient notification, conversation, and typing events. PostgreSQL
remains the source of truth.
