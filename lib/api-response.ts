export function success<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function failure(message: string, status = 500, code = "INTERNAL_ERROR") {
  return Response.json({ success: false, error: { code, message } }, { status })
}
