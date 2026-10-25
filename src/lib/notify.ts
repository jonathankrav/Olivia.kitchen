import { createServerFn } from '@tanstack/react-start'

export const notifyRequest = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ ok: boolean }> => {
  const input = (context as unknown as { data?: unknown }).data
  const { saveSiteOrder } = await import('@/server/orders-store')
  const { sendRequestNotification } = await import('@/server/telegram')
  const [saved, sent] = await Promise.allSettled([saveSiteOrder(input), sendRequestNotification(input)])
  return { ok: (saved.status === 'fulfilled' && saved.value) || (sent.status === 'fulfilled' && sent.value) }
})
