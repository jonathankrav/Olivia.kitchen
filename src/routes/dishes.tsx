import { createFileRoute } from '@tanstack/react-router'
import { DishesApp } from '@/components/Dishes'
import { OrdersLogin } from '@/components/Orders'
import { getDishes } from '@/lib/dishes'

export const Route = createFileRoute('/dishes')({
  head: () => ({
    meta: [
      { title: 'Меню и рецепты' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'noindex, nofollow, noarchive' },
    ],
  }),
  loader: () => getDishes(),
  component: DishesPage,
})

function DishesPage() {
  const state = Route.useLoaderData()
  return state.authed ? <DishesApp initial={state.recipes} configured={state.configured} /> : <OrdersLogin title="Меню и рецепты" />
}
