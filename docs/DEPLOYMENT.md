# Deployment

Configure the variables in `.env.example` in the deployment provider. Run
database migrations before starting the application:

```bash
npm ci
npm run db:deploy
npm run build
npm start
```

Verify `/api/health`, authentication, feed, posts, messaging, Redis, and
Pusher after deployment. Never commit `.env` or production credentials.
