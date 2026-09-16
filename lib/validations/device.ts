export const devicePlatforms = ["WEB", "ANDROID", "IOS", "DESKTOP"] as const

export type DevicePlatform = (typeof devicePlatforms)[number]

export function parseDeviceInput(value: unknown) {
  if (!value || typeof value !== "object") return null
  const input = value as Record<string, unknown>
  const token = typeof input.token === "string" ? input.token.trim() : ""
  const platform = input.platform
  const deviceId =
    input.deviceId === null || input.deviceId === undefined
      ? null
      : typeof input.deviceId === "string"
        ? input.deviceId.trim()
        : undefined

  if (
    !token ||
    token.length > 4096 ||
    typeof platform !== "string" ||
    !devicePlatforms.includes(platform as DevicePlatform) ||
    deviceId === undefined ||
    (deviceId !== null && deviceId.length > 255)
  ) {
    return null
  }

  return { token, platform, deviceId }
}
