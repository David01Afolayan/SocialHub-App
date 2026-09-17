CREATE TABLE IF NOT EXISTS "ApiSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "refreshToken" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ApiSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ApiSession_refreshToken_key"
  ON "ApiSession"("refreshToken");
CREATE INDEX IF NOT EXISTS "ApiSession_userId_idx"
  ON "ApiSession"("userId");
CREATE INDEX IF NOT EXISTS "ApiSession_expiresAt_idx"
  ON "ApiSession"("expiresAt");

ALTER TABLE "ApiSession" DROP CONSTRAINT IF EXISTS "ApiSession_userId_fkey";
ALTER TABLE "ApiSession"
  ADD CONSTRAINT "ApiSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
