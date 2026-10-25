import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import type { Order, OrdersState } from '@/lib/orders-types'

type Input = { data?: Record<string, unknown> }

async function authorised() {
  const auth = await import('@/server/orders-auth')
  return auth.sessionValid(getCookie(auth.ordersCookieName))
}

export const getOrders = createServerFn({ method: 'GET' }).handler(async (): Promise<OrdersState> => {
  if (!(await authorised())) return { authed: false }
  const store = await import('@/server/orders-store')
  try {
    return { authed: true, configured: store.storeConfigured(), orders: await store.listOrders() }
  } catch {
    return { authed: true, configured: false, orders: [] }
  }
})

export const loginOrders = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ ok: boolean }> => {
  const auth = await import('@/server/orders-auth')
  const input = (context as unknown as Input).data
  if (!auth.passwordMatches(input?.password)) {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { ok: false }
  }
  setCookie(auth.ordersCookieName, auth.sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 60,
    path: '/',
  })
  return { ok: true }
})

export const logoutOrders = createServerFn({ method: 'POST' }).handler(async (): Promise<{ ok: boolean }> => {
  const auth = await import('@/server/orders-auth')
  deleteCookie(auth.ordersCookieName, { path: '/' })
  return { ok: true }
})

export const updateOrder = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ order: Order | null }> => {
  if (!(await authorised())) return { order: null }
  const store = await import('@/server/orders-store')
  const input = (context as unknown as Input).data
  try {
    return { order: await store.updateOrder(input?.id, input?.patch) }
  } catch {
    return { order: null }
  }
})

export const createOrder = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ order: Order | null }> => {
  if (!(await authorised())) return { order: null }
  const store = await import('@/server/orders-store')
  try {
    return { order: await store.createManualOrder((context as unknown as Input).data) }
  } catch {
    return { order: null }
  }
})

export const removeOrder = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ ok: boolean }> => {
  if (!(await authorised())) return { ok: false }
  const store = await import('@/server/orders-store')
  try {
    return { ok: await store.deleteOrder((context as unknown as Input).data?.id) }
  } catch {
    return { ok: false }
  }
})
