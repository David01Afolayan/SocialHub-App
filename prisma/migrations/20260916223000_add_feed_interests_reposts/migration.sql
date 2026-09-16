ALTER TABLE "Post"
  ADD COLUMN IF NOT EXISTS "parentPostId" TEXT,
  ADD COLUMN IF NOT EXISTS "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
  ADD COLUMN IF NOT EXISTS "moderationStatus" TEXT NOT NULL DEFAULT 'APPROVED';

ALTER TABLE "Comment"
  ADD COLUMN IF NOT EXISTS "moderationStatus" TEXT NOT NULL DEFAULT 'APPROVED';

CREATE INDEX IF NOT EXISTS "Post_parentPostId_idx" ON "Post"("parentPostId");
CREATE INDEX IF NOT EXISTS "Comment_moderationStatus_idx" ON "Comment"("moderationStatus");

ALTER TABLE "Post" DROP CONSTRAINT IF EXISTS "Post_parentPostId_fkey";
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentPostId_fkey"
  FOREIGN KEY ("parentPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "UserInterest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserInterest_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "UserInterest_userId_topic_key" ON "UserInterest"("userId", "topic");
CREATE INDEX IF NOT EXISTS "UserInterest_userId_score_idx" ON "UserInterest"("userId", "score");
ALTER TABLE "UserInterest" DROP CONSTRAINT IF EXISTS "UserInterest_userId_fkey";
ALTER TABLE "UserInterest" ADD CONSTRAINT "UserInterest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
