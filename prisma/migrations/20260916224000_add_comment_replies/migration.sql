ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "parentId" TEXT;
CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");
ALTER TABLE "Comment" DROP CONSTRAINT IF EXISTS "Comment_parentId_fkey";
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
