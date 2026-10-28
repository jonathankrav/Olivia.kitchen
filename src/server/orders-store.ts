import { randomUUID } from 'node:crypto'
import { orderStatuses, type Order, type OrderPatch, type OrderStatus } from '@/lib/orders-types'

const hashKey = 'orders'
const statusValues = orderStatuses.map(item => item.value)
const recent: number[] = []

function endpoint() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url, token } : null
}

export function storeConfigured() {
  return endpoint() !== null
}

async function command(args: string[]): Promise<unknown> {
  const target = endpoint()
  if (!target) throw new Error('Storage is not configured')
  const response = await fetch(target.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${target.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  const body = (await response.json()) as { result?: unknown; error?: string }
  if (!response.ok || body.error) throw new Error(body.error ?? 'Storage request failed')
  return body.result
}

function text(value: unknown, limit: number) {
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim().slice(0, limit) : ''
}

function oneLine(value: unknown, limit: number) {
  return text(value, limit).replace(/\s+/g, ' ')
}

function amount(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const number = typeof value === 'number' ? value : Number(String(value).replace(',', '.').replace(/\s/g, ''))
  return Number.isFinite(number) && Math.abs(number) < 1e9 ? Math.round(number * 100) / 100 : null
}

function status(value: unknown): OrderStatus {
  return statusValues.includes(value as OrderStatus) ? (value as OrderStatus) : 'new'
}

function parse(raw: unknown): Order | null {
  if (typeof raw !== 'string') return null
  try {
    return JSON.parse(raw) as Order
  } catch {
    return null
  }
}

export async function listOrders(): Promise<Order[]> {
  if (!endpoint()) return []
  const flat = (await command(['HGETALL', hashKey])) as string[] | null
  const orders: Order[] = []
  for (let index = 1; flat && index < flat.length; index += 2) {
    const order = parse(flat[index])
    if (order) orders.push(order)
  }
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

async function save(order: Order) {
  await command(['HSET', hashKey, order.id, JSON.stringify(order)])
  return order
}

function build(fields: Record<string, unknown>, source: Order['source']): Order {
  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    source,
    name: oneLine(fields.name, 200),
    phone: oneLine(fields.phone, 80),
    email: oneLine(fields.email, 200),
    date: oneLine(fields.date, 120),
    guests: oneLine(fields.guests, 60),
    cuisine: oneLine(fields.cuisine, 120),
    language: oneLine(fields.language, 40),
    message: text(fields.message, 3000),
    origin: oneLine(fields.origin, 200),
    status: 'new',
    cost: null,
    revenue: null,
    expectations: '',
    result: '',
  }
}

export async function saveSiteOrder(input: unknown): Promise<boolean> {
  if (!endpoint() || typeof input !== 'object' || input === null) return false
  const fields = input as Record<string, unknown>
  if (oneLine(fields._honey, 20)) return false
  const order = build(fields, 'site')
  if (!order.name && !order.phone && !order.email && !order.message) return false
  const now = Date.now()
  while (recent.length > 0 && now - recent[0] > 60_000) recent.shift()
  if (recent.length >= 20) return false
  recent.push(now)
  await save(order)
  return true
}

export async function createManualOrder(input: unknown): Promise<Order | null> {
  if (!endpoint() || typeof input !== 'object' || input === null) return null
  const order = build(input as Record<string, unknown>, 'manual')
  if (!order.name && !order.phone && !order.message) return null
  return save(order)
}

export async function updateOrder(id: unknown, patch: unknown): Promise<Order | null> {
  if (!endpoint() || typeof id !== 'string' || id.length > 80 || typeof patch !== 'object' || patch === null) return null
  const current = parse(await command(['HGET', hashKey, id]))
  if (!current) return null
  const changes = patch as OrderPatch & Record<string, unknown>
  const next: Order = { ...current }
  if ('status' in changes) next.status = status(changes.status)
  if ('cost' in changes) next.cost = amount(changes.cost)
  if ('revenue' in changes) next.revenue = amount(changes.revenue)
  if ('expectations' in changes) next.expectations = text(changes.expectations, 8000)
  if ('result' in changes) next.result = text(changes.result, 8000)
  for (const [key, limit] of [['name', 200], ['phone', 80], ['email', 200], ['date', 120], ['guests', 60], ['cuisine', 120]] as const) {
    if (key in changes) next[key] = oneLine(changes[key], limit)
  }
  if ('message' in changes) next.message = text(changes.message, 3000)
  return save(next)
}

export async function deleteOrder(id: unknown): Promise<boolean> {
  if (!endpoint() || typeof id !== 'string' || id.length > 80) return false
  await command(['HDEL', hashKey, id])
  return true
}
