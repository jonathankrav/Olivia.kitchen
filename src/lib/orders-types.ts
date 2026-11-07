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
  confirmedGuests: string | null
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

export type OrderPatch = Partial<Pick<Order, 'status' | 'cost' | 'revenue' | 'expectations' | 'result' | 'proposedMenu' | 'finalMenu' | 'dishware' | 'other' | 'otherNote' | 'notes' | 'name' | 'phone' | 'email' | 'date' | 'guests' | 'cuisine' | 'message' | 'confirmedGuests'>>

export type OrdersState = { authed: false } | { authed: true; configured: boolean; orders: Order[] }

export function orderExpenses(order: Pick<Order, 'cost' | 'dishware' | 'other'>) {
  return (order.cost ?? 0) + (order.dishware ?? 0) + (order.other ?? 0)
}

export function orderProfit(order: Pick<Order, 'cost' | 'dishware' | 'other' | 'revenue'>) {
  return order.revenue === null ? null : order.revenue - orderExpenses(order)
}

export function formatEventDate(value: string) {
  const text = value.trim()
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text)
  const local = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2}|\d{4})$/.exec(text)
  let year = 0
  let month = 0
  let day = 0
  if (iso) {
    year = Number(iso[1])
    month = Number(iso[2])
    day = Number(iso[3])
  } else if (local) {
    day = Number(local[1])
    month = Number(local[2])
    year = Number(local[3]) < 100 ? 2000 + Number(local[3]) : Number(local[3])
  } else return text
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return text
  const weekday = date.toLocaleDateString('he-IL', { weekday: 'long', timeZone: 'UTC' })
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}, ${weekday}`
}
