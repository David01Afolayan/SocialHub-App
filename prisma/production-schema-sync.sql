ALTER TABLE "ChatMessage"
  ADD COLUMN IF NOT EXISTS "senderId" TEXT,
  ADD COLUMN IF NOT EXISTS "receiverId" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "ChatMessage"
SET
  "senderId" = COALESCE("senderId", (SELECT "id" FROM "User" ORDER BY "createdAt" LIMIT 1)),
  "receiverId" = COALESCE("receiverId", (SELECT "id" FROM "User" ORDER BY "createdAt" LIMIT 1)),
  "updatedAt" = COALESCE("updatedAt", "createdAt");

ALTER TABLE "ChatMessage"
  ALTER COLUMN "senderId" SET NOT NULL,
  ALTER COLUMN "receiverId" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL;
