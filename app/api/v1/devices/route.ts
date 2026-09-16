import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import {
  deactivateDevice,
  registerDevice,
} from "@/lib/repositories/device.repository"
import { parseDeviceInput } from "@/lib/validations/device"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    const input = parseDeviceInput(await request.json())
    if (!input) {
      return failure("Invalid device data.", 400, "INVALID_DEVICE")
    }

    return success(await registerDevice({
      userId: session.user.id,
      ...input,
    }))
  } catch (error) {
    console.error("DEVICE_REGISTER_ERROR", error)
    return failure("Unable to register device.", 500, "INTERNAL_ERROR")
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    const body = await request.json()
    const token = typeof body?.token === "string" ? body.token.trim() : ""
    if (!token || token.length > 4096) {
      return failure("Device token is required.", 400, "TOKEN_REQUIRED")
    }

    await deactivateDevice(session.user.id, token)
    return success({ deactivated: true })
  } catch (error) {
    console.error("DEVICE_REMOVE_ERROR", error)
    return failure("Unable to remove device.", 500, "INTERNAL_ERROR")
  }
}
