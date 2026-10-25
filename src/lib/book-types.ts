export type RecipeGroup = { title?: string; items: string[] }

export type ArtPiece = { src: string; x: number; y: number; w: number; r: number }

export type BookArt = { ratio: number; pieces: { dish?: ArtPiece; top?: ArtPiece; bl?: ArtPiece; br?: ArtPiece } }

export type Recipe = {
  id: string
  title: string
  subtitle?: string
  listTitle?: string
  meta?: string[]
  ingredients: RecipeGroup[]
  steps: string[]
  note?: string
  caption?: string
  illustration?: string
  art?: BookArt
}

export type Book = {
  title: string
  subtitle: string
  cover: string
  recipes: Recipe[]
}

export type BookState = { authed: false } | { authed: true; book: Book }
