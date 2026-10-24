export type RecipeGroup = { title?: string; items: string[] }

export type Recipe = {
  id: string
  title: string
  subtitle?: string
  meta?: string[]
  ingredients: RecipeGroup[]
  steps: string[]
  note?: string
  caption?: string
  illustration?: string
}

export type Book = {
  title: string
  subtitle: string
  cover: string
  recipes: Recipe[]
}

export type BookState = { authed: false } | { authed: true; book: Book }
