import { createServerFn } from '@tanstack/react-start'
import { isDateFromToday, isEmail, isGuests, isPhone, messageMax, nameMax, todayISO } from '@/lib/form-validation'

function validInquiry(input: unknown) {
  if (!input || typeof input !== 'object') return false
  const field = (key: string) => String((input as Record<string, unknown>)[key] ?? '').trim()
  const yesterday = todayISO(new Date(Date.now() - 36 * 3600 * 1000))
  return (
    field('name').length >= 2 && field('name').length <= nameMax &&
    isEmail(field('email')) &&
    (!field('phone') || isPhone(field('phone'))) &&
    (!field('guests') || isGuests(field('guests'))) &&
    (!field('date') || isDateFromToday(field('date'), yesterday)) &&
    field('message').length <= messageMax
  )
}

export const notifyRequest = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ ok: boolean; mail: boolean }> => {
  const input = (context as unknown as { data?: unknown }).data
  if (!validInquiry(input)) return { ok: false, mail: true }
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
