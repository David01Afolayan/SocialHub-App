ALTER TABLE "ChatMessage"
  ADD COLUMN IF NOT EXISTS "senderId" TEXT,
  ADD COLUMN IF NOT EXISTS "receiverId" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "ChatMessage"
SET
  "senderId" = COALESCE("senderId", "authorId"),
  "receiverId" = COALESCE("receiverId", "authorId"),
  "updatedAt" = COALESCE("updatedAt", "createdAt");
