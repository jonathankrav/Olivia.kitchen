import { parseNumber, type Recipe, type RecipeUnit } from '@/lib/dishes-types'
import type { Order } from '@/lib/orders-types'

export type ShoppingLine = {
  key: string
  name: string
  unit: RecipeUnit | ''
  qty: number
  cost: number | null
  unpriced: boolean
  dishes: string[]
}

export type ShoppingList = {
  guests: number | null
  lines: ShoppingLine[]
  missing: { dish: string; reason: string }[]
}

export function guestCount(order: Pick<Order, 'confirmedGuests' | 'guests'>): number | null {
  const match = /\d+/.exec(order.confirmedGuests ?? order.guests)
  const value = match ? Number(match[0]) : 0
  return value > 0 ? value : null
}

export function buildShoppingList(order: Order, recipes: Record<string, Recipe>): ShoppingList {
  const guests = guestCount(order)
  const menu = order.finalMenu ?? order.proposedMenu
  const lines = new Map<string, ShoppingLine>()
  const missing: ShoppingList['missing'] = []
  for (const dish of menu) {
    const recipe = recipes[dish]
    const rows = recipe ? recipe.rows.filter(row => row.name.trim() !== '') : []
    if (!recipe || rows.length === 0) {
      missing.push({ dish, reason: 'нет рецепта' })
      continue
    }
    const portions = parseNumber(recipe.portions)
    if (portions === null || portions <= 0) {
      missing.push({ dish, reason: 'в рецепте не указано число порций' })
      continue
    }
    if (guests === null) continue
    const serves = parseNumber(recipe.serves)
    const needed = Math.ceil(guests / (serves !== null && serves > 0 ? serves : 1))
    const factor = needed / portions
    for (const row of rows) {
      const qty = parseNumber(row.qty)
      if (qty === null) continue
      const name = row.name.trim()
      const key = `${name.toLowerCase()}|${row.unit}`
      const price = parseNumber(row.priceManual) ?? parseNumber(row.priceWeb)
      const amount = qty * factor
      const line = lines.get(key) ?? { key, name, unit: row.unit, qty: 0, cost: null, unpriced: false, dishes: [] }
      line.qty += amount
      if (price === null) line.unpriced = true
      else line.cost = (line.cost ?? 0) + amount * price
      if (!line.dishes.includes(dish)) line.dishes.push(dish)
      lines.set(key, line)
    }
  }
  return { guests, lines: [...lines.values()].sort((a, b) => a.name.localeCompare(b.name, 'ru')), missing }
}

export function displayQty(line: Pick<ShoppingLine, 'qty' | 'unit'>) {
  const value = line.unit === 'шт' || line.unit === 'уп' ? Math.ceil(line.qty - 1e-9) : Math.round(line.qty * 100) / 100
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${line.unit}`.trim()
}
