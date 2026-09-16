CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConversationMember" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ChatMessage"
  ADD COLUMN "conversationId" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "readAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "ConversationMember_conversationId_userId_key"
  ON "ConversationMember"("conversationId", "userId");
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");
CREATE INDEX "ConversationMember_userId_idx" ON "ConversationMember"("userId");
CREATE INDEX "ChatMessage_conversationId_createdAt_idx"
  ON "ChatMessage"("conversationId", "createdAt");

ALTER TABLE "ConversationMember"
  ADD CONSTRAINT "ConversationMember_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConversationMember"
  ADD CONSTRAINT "ConversationMember_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatMessage"
  ADD CONSTRAINT "ChatMessage_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

WITH pairs AS (
  SELECT DISTINCT
    CASE WHEN "senderId" < "receiverId"
      THEN "senderId" ELSE "receiverId" END AS user_a,
    CASE WHEN "senderId" < "receiverId"
      THEN "receiverId" ELSE "senderId" END AS user_b
  FROM "ChatMessage"
  WHERE "senderId" <> "receiverId"
),
created AS (
  INSERT INTO "Conversation" ("id", "updatedAt")
  SELECT 'legacy_' || md5(user_a || ':' || user_b), CURRENT_TIMESTAMP
  FROM pairs
  ON CONFLICT ("id") DO NOTHING
  RETURNING "id"
)
INSERT INTO "ConversationMember" ("id", "conversationId", "userId")
SELECT 'legacy_member_' || md5(c.id || ':' || u.user_id), c.id, u.user_id
FROM (
  SELECT 'legacy_' || md5(user_a || ':' || user_b) AS id, user_a, user_b
  FROM pairs
) c
CROSS JOIN LATERAL (VALUES (c.user_a), (c.user_b)) AS u(user_id)
ON CONFLICT ("conversationId", "userId") DO NOTHING;

UPDATE "ChatMessage" m
SET "conversationId" = 'legacy_' || md5(
  CASE WHEN m."senderId" < m."receiverId"
    THEN m."senderId" || ':' || m."receiverId"
    ELSE m."receiverId" || ':' || m."senderId"
  END
)
WHERE m."senderId" <> m."receiverId";
