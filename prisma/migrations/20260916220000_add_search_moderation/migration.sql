ALTER TABLE "Post"
  ADD COLUMN IF NOT EXISTS "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
  ADD COLUMN IF NOT EXISTS "moderationStatus" TEXT NOT NULL DEFAULT 'APPROVED';

CREATE TABLE IF NOT EXISTS "SearchHistory" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "query" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "SearchHistory_userId_createdAt_idx" ON "SearchHistory"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "SearchHistory_userId_query_idx" ON "SearchHistory"("userId", "query");
ALTER TABLE "SearchHistory" DROP CONSTRAINT IF EXISTS "SearchHistory_userId_fkey";
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "TrendingSearch" (
  "id" TEXT NOT NULL,
  "query" TEXT NOT NULL,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "searchCount" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TrendingSearch_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "TrendingSearch_query_key" ON "TrendingSearch"("query");
CREATE INDEX IF NOT EXISTS "TrendingSearch_score_idx" ON "TrendingSearch"("score");
CREATE INDEX IF NOT EXISTS "TrendingSearch_updatedAt_idx" ON "TrendingSearch"("updatedAt");

CREATE TABLE IF NOT EXISTS "Hashtag" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Hashtag_name_key" ON "Hashtag"("name");
CREATE INDEX IF NOT EXISTS "Hashtag_name_idx" ON "Hashtag"("name");

CREATE TABLE IF NOT EXISTS "PostHashtag" (
  "postId" TEXT NOT NULL,
  "hashtagId" TEXT NOT NULL,
  CONSTRAINT "PostHashtag_pkey" PRIMARY KEY ("postId", "hashtagId")
);
CREATE INDEX IF NOT EXISTS "PostHashtag_hashtagId_idx" ON "PostHashtag"("hashtagId");
ALTER TABLE "PostHashtag" DROP CONSTRAINT IF EXISTS "PostHashtag_postId_fkey";
ALTER TABLE "PostHashtag" ADD CONSTRAINT "PostHashtag_postId_fkey"
  FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostHashtag" DROP CONSTRAINT IF EXISTS "PostHashtag_hashtagId_fkey";
ALTER TABLE "PostHashtag" ADD CONSTRAINT "PostHashtag_hashtagId_fkey"
  FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "ModerationResult" (
  "id" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "reasons" JSONB,
  "reviewed" BOOLEAN NOT NULL DEFAULT false,
  "reviewedById" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ModerationResult_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ModerationResult_targetType_targetId_idx" ON "ModerationResult"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "ModerationResult_decision_createdAt_idx" ON "ModerationResult"("decision", "createdAt");
CREATE INDEX IF NOT EXISTS "ModerationResult_reviewedById_idx" ON "ModerationResult"("reviewedById");
ALTER TABLE "ModerationResult" ADD CONSTRAINT "ModerationResult_reviewedById_fkey"
  FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "ModerationAppeal" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "moderationResultId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "reviewedById" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ModerationAppeal_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ModerationAppeal_userId_createdAt_idx" ON "ModerationAppeal"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "ModerationAppeal_status_createdAt_idx" ON "ModerationAppeal"("status", "createdAt");
ALTER TABLE "ModerationAppeal" ADD CONSTRAINT "ModerationAppeal_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ModerationAppeal" ADD CONSTRAINT "ModerationAppeal_moderationResultId_fkey"
  FOREIGN KEY ("moderationResultId") REFERENCES "ModerationResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ModerationAppeal" ADD CONSTRAINT "ModerationAppeal_reviewedById_fkey"
  FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
