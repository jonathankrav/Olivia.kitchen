import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const ordersCookieName = 'ok_orders'

function secret() {
  return process.env.ORDERS_PASSWORD || process.env.RECIPE_BOOK_PASSWORD || ''
}

function digest(value: string) {
  return createHash('sha256').update(value).digest()
}

export function passwordMatches(input: unknown) {
  const expected = secret()
  if (!expected || typeof input !== 'string' || input.length === 0 || input.length > 200) return false
  return timingSafeEqual(digest(input), digest(expected))
}

export function sessionToken() {
  return createHmac('sha256', secret()).update('olivia-orders-v1').digest('hex')
}

export function sessionValid(token: string | undefined) {
  if (!secret() || !token || token.length !== 64) return false
  return timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken()))
}
