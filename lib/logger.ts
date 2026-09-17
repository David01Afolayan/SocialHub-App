type LogMeta = Record<string, unknown>

function write(level: string, message: string, meta?: LogMeta) {
  const entry = JSON.stringify({ level, message, meta, timestamp: new Date().toISOString() })
  if (level === "error") console.error(entry)
  else if (level === "warn") console.warn(entry)
  else console.log(entry)
}

export const logger = {
  info(message: string, meta?: LogMeta) { write("info", message, meta) },
  warn(message: string, meta?: LogMeta) { write("warn", message, meta) },
  error(message: string, meta?: LogMeta) { write("error", message, meta) },
}
