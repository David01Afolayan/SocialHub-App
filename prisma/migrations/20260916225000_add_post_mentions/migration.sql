CREATE TABLE IF NOT EXISTS "PostMention" (
  "postId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "PostMention_pkey" PRIMARY KEY ("postId", "userId")
);

CREATE INDEX IF NOT EXISTS "PostMention_userId_idx" ON "PostMention"("userId");

ALTER TABLE "PostMention" DROP CONSTRAINT IF EXISTS "PostMention_postId_fkey";
ALTER TABLE "PostMention" ADD CONSTRAINT "PostMention_postId_fkey"
  FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PostMention" DROP CONSTRAINT IF EXISTS "PostMention_userId_fkey";
ALTER TABLE "PostMention" ADD CONSTRAINT "PostMention_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
