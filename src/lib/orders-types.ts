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
  proposedMenu: string[]
  finalMenu: string[] | null
  dishware: number | null
  other: number | null
  otherNote: string
  notes: string
}

export type OrderPatch = Partial<Pick<Order, 'status' | 'cost' | 'revenue' | 'expectations' | 'result' | 'proposedMenu' | 'finalMenu' | 'dishware' | 'other' | 'otherNote' | 'notes' | 'name' | 'phone' | 'email' | 'date' | 'guests' | 'cuisine' | 'message'>>

export type OrdersState = { authed: false } | { authed: true; configured: boolean; orders: Order[] }

export function orderExpenses(order: Pick<Order, 'cost' | 'dishware' | 'other'>) {
  return (order.cost ?? 0) + (order.dishware ?? 0) + (order.other ?? 0)
}

export function orderProfit(order: Pick<Order, 'cost' | 'dishware' | 'other' | 'revenue'>) {
  return order.revenue === null ? null : order.revenue - orderExpenses(order)
}
