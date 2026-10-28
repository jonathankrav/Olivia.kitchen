export type OrderStatus = 'new' | 'talking' | 'confirmed' | 'done' | 'cancelled'

export const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: 'new', label: 'Новая' },
  { value: 'talking', label: 'Согласование' },
  { value: 'confirmed', label: 'Подтверждена' },
  { value: 'done', label: 'Выполнена' },
  { value: 'cancelled', label: 'Отменена' },
]

export type Order = {
  id: string
  createdAt: string
  source: 'site' | 'manual'
  name: string
  phone: string
  email: string
  date: string
  guests: string
  cuisine: string
  language: string
  message: string
  origin?: string
  status: OrderStatus
  cost: number | null
  revenue: number | null
  expectations: string
  result: string
}

export type OrderPatch = Partial<Pick<Order, 'status' | 'cost' | 'revenue' | 'expectations' | 'result' | 'name' | 'phone' | 'email' | 'date' | 'guests' | 'cuisine' | 'message'>>

export type OrdersState = { authed: false } | { authed: true; configured: boolean; orders: Order[] }

export function orderProfit(order: Pick<Order, 'cost' | 'revenue'>) {
  return order.revenue === null ? null : order.revenue - (order.cost ?? 0)
}
