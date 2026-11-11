export const recipeUnits = ['кг', 'литр', 'ст л', 'ч л', 'шт', 'уп'] as const
export type RecipeUnit = (typeof recipeUnits)[number]

export type RecipeRow = {
  id: string
  name: string
  qty: string
  unit: RecipeUnit | ''
  priceWeb: string
  priceManual: string
  added: boolean
}

export type Recipe = {
  portions: string
  serves: string
  calcPortions: string
  locked: boolean
  rows: RecipeRow[]
}

export type CustomDish = { ru: string; en: string; he: string; category: number }

export type DishesState =
  | { authed: false }
  | { authed: true; configured: boolean; recipes: Record<string, Recipe>; extras: CustomDish[] }

export const emptyRecipe: Recipe = { portions: '', serves: '', calcPortions: '', locked: false, rows: [] }

export function parseNumber(value: string): number | null {
  const cleaned = value.replace(/\s/g, '').replace(',', '.')
  if (cleaned === '') return null
  const number = Number(cleaned)
  return Number.isFinite(number) && number >= 0 ? number : null
}
