import Pusher from "pusher"

const requiredPusherEnvironment = [
  "PUSHER_APP_ID",
  "PUSHER_KEY",
  "PUSHER_SECRET",
  "PUSHER_CLUSTER",
] as const

function getPusherConfig() {
  const missing = requiredPusherEnvironment.filter((name) => !process.env[name])
  if (missing.length > 0) {
    throw new Error(`Missing Pusher configuration: ${missing.join(", ")}`)
  }

  return {
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
  }
}

let pusher: Pusher | undefined

export function getPusher() {
  if (!pusher) {
    pusher = new Pusher({
      ...getPusherConfig(),
      useTLS: true,
    })
  }

  return pusher
}
