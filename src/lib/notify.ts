import { createServerFn } from '@tanstack/react-start'

export const notifyRequest = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ ok: boolean; mail: boolean }> => {
  const input = (context as unknown as { data?: unknown }).data
  const { saveSiteOrder } = await import('@/server/orders-store')
  const { sendRequestNotification } = await import('@/server/telegram')
  const { sendRequestEmail } = await import('@/server/mail')
  const [saved, sent, mailed] = await Promise.allSettled([saveSiteOrder(input), sendRequestNotification(input), sendRequestEmail(input)])
  const yes = (result: PromiseSettledResult<boolean>) => result.status === 'fulfilled' && result.value
  return { ok: yes(saved) || yes(sent) || yes(mailed), mail: yes(mailed) }
})

export const reportMailProblem = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ ok: boolean }> => {
  const { sendMailProblem } = await import('@/server/telegram')
  const detail = (context as unknown as { data?: { detail?: unknown } }).data?.detail
  try {
    return { ok: await sendMailProblem(detail) }
  } catch {
    return { ok: false }
  }
})
