import { command } from '@/server/orders-store'
import { sections } from '@/lib/content'
import type { CustomDish } from '@/lib/dishes-types'

const hashKey = 'menu_extra'
const categoryCount = sections.ru.menu.categories.length
const builtIn = new Set(sections.ru.menu.categories.flatMap(category => category.items.map(item => item.toLowerCase())))

function line(value: unknown, limit: number) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, limit) : ''
}

export async function listExtras(): Promise<CustomDish[]> {
  const raw = (await command(['HGETALL', hashKey])) as string[] | null
  const result: (CustomDish & { at: number })[] = []
  if (!Array.isArray(raw)) return []
  for (let index = 0; index + 1 < raw.length; index += 2) {
    try {
      const item = JSON.parse(raw[index + 1]) as Record<string, unknown>
      const category = Number(item.category)
      const ru = line(item.ru, 90)
      if (!ru || !Number.isInteger(category) || category < 0 || category >= categoryCount) continue
      result.push({ ru, en: line(item.en, 90), he: line(item.he, 90), category, at: Number(item.at) || 0 })
    } catch {}
  }
  return result.sort((a, b) => a.at - b.at).map(({ at: _at, ...dish }) => dish)
}

export async function hasExtra(name: string) {
  return (await command(['HEXISTS', hashKey, name])) === 1
}

export async function addExtra(value: unknown): Promise<{ dish: CustomDish } | { error: string }> {
  const input = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  const ru = line(input.ru, 90)
  const category = Number(input.category)
  if (!ru) return { error: 'Введите название блюда.' }
  if (!Number.isInteger(category) || category < 0 || category >= categoryCount) return { error: 'Выберите раздел.' }
  if (builtIn.has(ru.toLowerCase()) || (await hasExtra(ru))) return { error: 'Такое блюдо уже есть в меню.' }
  const dish: CustomDish = { ru, en: line(input.en, 90), he: line(input.he, 90), category }
  await command(['HSET', hashKey, ru, JSON.stringify({ ...dish, at: Date.now() })])
  return { dish }
}
