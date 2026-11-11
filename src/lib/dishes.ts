import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type { CustomDish, DishesState, Recipe } from '@/lib/dishes-types'

type Input = { data?: Record<string, unknown> }

async function authorised() {
  const auth = await import('@/server/orders-auth')
  return auth.sessionValid(getCookie(auth.ordersCookieName))
}

export const getDishes = createServerFn({ method: 'GET' }).handler(async (): Promise<DishesState> => {
  if (!(await authorised())) return { authed: false }
  const orders = await import('@/server/orders-store')
  if (!orders.storeConfigured()) return { authed: true, configured: false, recipes: {}, extras: [] }
  try {
    const store = await import('@/server/dishes-store')
    const extras = await import('@/server/menu-extras-store')
    return { authed: true, configured: true, recipes: await store.listRecipes(), extras: await extras.listExtras() }
  } catch {
    return { authed: true, configured: false, recipes: {}, extras: [] }
  }
})

export const saveDish = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ recipe: Recipe | null }> => {
  if (!(await authorised())) return { recipe: null }
  const input = (context as unknown as Input).data
  try {
    const store = await import('@/server/dishes-store')
    return { recipe: await store.saveRecipe(input?.id, input?.recipe) }
  } catch {
    return { recipe: null }
  }
})

export const addDish = createServerFn({ method: 'POST' }).handler(async (context): Promise<{ dish: CustomDish | null; error?: string }> => {
  if (!(await authorised())) return { dish: null, error: 'Нужно войти заново.' }
  const input = (context as unknown as Input).data
  try {
    const store = await import('@/server/menu-extras-store')
    const result = await store.addExtra(input)
    return 'dish' in result ? { dish: result.dish } : { dish: null, error: result.error }
  } catch {
    return { dish: null, error: 'Не удалось сохранить. Попробуйте ещё раз.' }
  }
})
