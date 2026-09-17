# API

## Posts

- `GET /api/v1/posts/:id`
- `POST /api/v1/posts`
- `PATCH /api/v1/posts/:id`
- `DELETE /api/v1/posts/:id`
- `POST /api/v1/posts/:id/repost`
- `GET|POST /api/v1/posts/:id/comments`

## Feed and discovery

- `GET /api/v1/feed`
- `GET /api/v1/feed/personalized`
- `GET /api/v1/search`
- `GET /api/v1/search/suggestions`
- `GET /api/v1/hashtags/:name`

## Messaging

- `GET|POST /api/v1/conversations`
- `GET|POST /api/v1/conversations/:id/messages`
- `POST /api/v1/conversations/:id/read`
- `POST /api/v1/conversations/:id/typing`
- `POST|DELETE /api/v1/messages/:id/reactions`

## Operations

- `GET /api/health`
- `GET /api/v1/health`
