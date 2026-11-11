import { createServerFn } from '@tanstack/react-start'
import type { CustomDish } from '@/lib/dishes-types'

export const getMenuExtras = createServerFn({ method: 'GET' }).handler(async (): Promise<CustomDish[]> => {
  try {
    const orders = await import('@/server/orders-store')
    if (!orders.storeConfigured()) return []
    const store = await import('@/server/menu-extras-store')
    return await store.listExtras()
  } catch {
    return []
  }
})
