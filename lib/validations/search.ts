import { z } from "zod"

export const searchSchema = z.object({
  q: z.string().trim().min(1).max(100),
  type: z.enum(["ALL", "USERS", "POSTS", "HASHTAGS"]).default("ALL"),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})
