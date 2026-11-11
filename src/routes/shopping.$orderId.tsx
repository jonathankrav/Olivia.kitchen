import { createFileRoute } from '@tanstack/react-router'
import { OrdersLogin } from '@/components/Orders'
import { ShoppingApp } from '@/components/Shopping'
import { getShopping } from '@/lib/orders'

type Call<T> = (options: { data: Record<string, unknown> }) => Promise<T>

export const Route = createFileRoute('/shopping/$orderId')({
  head: () => ({
    meta: [
      { title: 'Закупка' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'noindex, nofollow, noarchive' },
    ],
  }),
  loader: ({ params }) => (getShopping as unknown as Call<Awaited<ReturnType<typeof getShopping>>>)({ data: { id: params.orderId } }),
  component: ShoppingPage,
})

function ShoppingPage() {
  const state = Route.useLoaderData()
  if (!state.authed) return <OrdersLogin title="Закупка" />
  return <ShoppingApp order={state.order} recipes={state.recipes} />
}
