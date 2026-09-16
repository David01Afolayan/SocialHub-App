ALTER TABLE "Conversation"
  ADD COLUMN "name" TEXT,
  ADD COLUMN "image" TEXT,
  ADD COLUMN "isGroup" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "ConversationMember"
  ADD COLUMN "role" TEXT NOT NULL DEFAULT 'MEMBER';

CREATE INDEX "Conversation_isGroup_idx" ON "Conversation"("isGroup");
CREATE INDEX "ConversationMember_conversationId_idx"
  ON "ConversationMember"("conversationId");
