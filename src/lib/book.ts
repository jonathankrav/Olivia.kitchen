import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import type { BookState } from '@/lib/book-types'

export const getBook = createServerFn({ method: 'GET' }).handler(async (): Promise<BookState> => {
  const auth = await import('@/server/book-auth')
  if (!auth.sessionValid(getCookie(auth.bookCookieName))) return { authed: false }
  const { book } = await import('@/server/book-data')
  return { authed: true, book }
})

export const loginBook = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ ok: boolean }> => {
  const auth = await import('@/server/book-auth')
  const input = (context as unknown as { data?: { password?: unknown } }).data
  if (!auth.passwordMatches(input?.password)) {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { ok: false }
  }
  setCookie(auth.bookCookieName, auth.sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 60,
    path: '/',
  })
  return { ok: true }
})

export const logoutBook = createServerFn({ method: 'POST' }).handler(async (): Promise<{ ok: boolean }> => {
  const auth = await import('@/server/book-auth')
  deleteCookie(auth.bookCookieName, { path: '/' })
  return { ok: true }
})
