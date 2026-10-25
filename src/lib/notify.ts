import { createServerFn } from '@tanstack/react-start'

export const notifyRequest = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ ok: boolean }> => {
  const { sendRequestNotification } = await import('@/server/telegram')
  const input = (context as unknown as { data?: unknown }).data
  try {
    return { ok: await sendRequestNotification(input) }
  } catch {
    return { ok: false }
  }
})
