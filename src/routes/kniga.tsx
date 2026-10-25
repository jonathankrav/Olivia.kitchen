import { createFileRoute } from '@tanstack/react-router'
import { BookLogin, RecipeBook } from '@/components/RecipeBook'
import { getBook } from '@/lib/book'

export const Route = createFileRoute('/kniga')({
  head: () => ({
    meta: [
      { title: 'Книга рецептов' },
      { name: 'robots', content: 'noindex, nofollow, noarchive' },
    ],
    links: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Caveat:wght@500;700&family=Marck+Script&display=swap' },
    ],
  }),
  loader: () => getBook(),
  component: BookPage,
})

function BookPage() {
  const state = Route.useLoaderData()
  return state.authed ? <RecipeBook book={state.book} /> : <BookLogin />
}
