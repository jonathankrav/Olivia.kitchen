import { command } from '@/server/orders-store'
import { sections } from '@/lib/content'
import { emptyRecipe, recipeUnits, type Recipe, type RecipeRow, type RecipeUnit } from '@/lib/dishes-types'

const hashKey = 'dishes'
const knownDishes = new Set(sections.ru.menu.categories.flatMap(category => [...category.items]))

function line(value: unknown, limit: number) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, limit) : ''
}

function numeric(value: unknown) {
  const text = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : ''
  return /^\d{0,9}([.,]\d{0,4})?$/.test(text) ? text : ''
}

function row(value: unknown): RecipeRow | null {
  if (!value || typeof value !== 'object') return null
  const item = value as Record<string, unknown>
  const unit = recipeUnits.includes(item.unit as RecipeUnit) ? (item.unit as RecipeUnit) : ''
  return {
    id: line(item.id, 40) || Math.random().toString(36).slice(2, 10),
    name: line(item.name, 120),
    qty: numeric(item.qty),
    unit,
    priceWeb: numeric(item.priceWeb),
    priceManual: numeric(item.priceManual),
    added: item.added === true,
  }
}

function recipe(value: unknown): Recipe {
  if (!value || typeof value !== 'object') return { ...emptyRecipe }
  const item = value as Record<string, unknown>
  const rows = (Array.isArray(item.rows) ? item.rows : []).slice(0, 80).map(row).filter((entry): entry is RecipeRow => entry !== null)
  return { portions: numeric(item.portions), serves: numeric(item.serves), calcPortions: numeric(item.calcPortions), locked: item.locked === true, rows }
}

export async function listRecipes(): Promise<Record<string, Recipe>> {
  const raw = (await command(['HGETALL', hashKey])) as string[] | null
  const result: Record<string, Recipe> = {}
  if (!Array.isArray(raw)) return result
  for (let index = 0; index + 1 < raw.length; index += 2) {
    try {
      result[raw[index]] = recipe(JSON.parse(raw[index + 1]))
    } catch {}
  }
  return result
}

export async function saveRecipe(id: unknown, value: unknown): Promise<Recipe | null> {
  if (typeof id !== 'string' || !knownDishes.has(id)) return null
  const clean = recipe(value)
  await command(['HSET', hashKey, id, JSON.stringify(clean)])
  return clean
}
