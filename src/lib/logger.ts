type LogMeta = Record<string, string | number | boolean | undefined>

function write(level: 'info' | 'error', message: string, meta?: LogMeta): void {
  const payload = { level, message, ...meta }
  if (level === 'error') {
    console.error(JSON.stringify(payload))
    return
  }
  console.info(JSON.stringify(payload))
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    write('info', message, meta)
  },
  error(message: string, meta?: LogMeta): void {
    write('error', message, meta)
  },
}
