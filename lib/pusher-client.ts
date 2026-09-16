"use client"

import PusherClient from "pusher-js"

let pusherClient: PusherClient | null = null

export function getPusherClient() {
  if (pusherClient) {
    return pusherClient
  }

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
  if (!key || !cluster) {
    throw new Error("Missing public Pusher configuration")
  }

  pusherClient = new PusherClient(key, { cluster, channelAuthorization: { endpoint: "/api/pusher/auth", transport: "ajax" } })
  return pusherClient
}
