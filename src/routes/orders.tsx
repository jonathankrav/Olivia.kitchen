import { createFileRoute } from '@tanstack/react-router'
import { OrdersApp, OrdersLogin } from '@/components/Orders'
import { getOrders } from '@/lib/orders'

export const Route = createFileRoute('/orders')({
  head: () => ({
    meta: [
      { title: 'Заявки' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'noindex, nofollow, noarchive' },
    ],
  }),
  loader: () => getOrders(),
  component: OrdersPage,
})

function OrdersPage() {
  const state = Route.useLoaderData()
  return state.authed ? <OrdersApp key={state.orders.map(order => order.id).join('|')} initial={state.orders} configured={state.configured} /> : <OrdersLogin />
}
