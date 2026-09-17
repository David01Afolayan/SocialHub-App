import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export type AnalyticsEventType =
  | "PAGE_VIEW"
  | "POST_VIEW"
  | "POST_CREATED"
  | "POST_LIKED"
  | "POST_COMMENTED"
  | "POST_REPOSTED"
  | "MESSAGE_SENT"
  | "SEARCH"
  | "FOLLOW"

export function trackEvent(input: {
  userId?: string
  type: AnalyticsEventType
  entityId?: string
  metadata?: Prisma.InputJsonValue
}) {
  return prisma.analyticsEvent.create({
    data: {
      userId: input.userId,
      type: input.type,
      entityId: input.entityId,
      metadata: input.metadata,
    },
  })
}
