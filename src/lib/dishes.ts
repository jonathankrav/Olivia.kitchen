import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type { DishesState, Recipe } from '@/lib/dishes-types'

type Input = { data?: Record<string, unknown> }

async function authorised() {
  const auth = await import('@/server/orders-auth')
  return auth.sessionValid(getCookie(auth.ordersCookieName))
}

export const getDishes = createServerFn({ method: 'GET' }).handler(async (): Promise<DishesState> => {
  if (!(await authorised())) return { authed: false }
  const orders = await import('@/server/orders-store')
  if (!orders.storeConfigured()) return { authed: true, configured: false, recipes: {} }
  try {
    const store = await import('@/server/dishes-store')
    return { authed: true, configured: true, recipes: await store.listRecipes() }
  } catch {
    return { authed: true, configured: false, recipes: {} }
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
