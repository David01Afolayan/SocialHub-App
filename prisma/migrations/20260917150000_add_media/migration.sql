CREATE TABLE "Media" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "key" TEXT,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "duration" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "uploadedById" TEXT NOT NULL,
  CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Media_uploadedById_idx" ON "Media"("uploadedById");
CREATE INDEX "Media_createdAt_idx" ON "Media"("createdAt");
CREATE INDEX "ChatMessage_mediaId_idx" ON "ChatMessage"("mediaId");

ALTER TABLE "Media"
  ADD CONSTRAINT "Media_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChatMessage"
  ADD CONSTRAINT "ChatMessage_mediaId_fkey"
  FOREIGN KEY ("mediaId") REFERENCES "Media"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
