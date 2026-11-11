import { createFileRoute } from '@tanstack/react-router'
import { Landing } from '@/components/Landing'
import { seoHead } from '@/lib/content'
import { getMenuExtras } from '@/lib/menu-extras'

export const Route = createFileRoute('/en')({
  head: () => seoHead('en'),
  loader: () => getMenuExtras(),
  component: Page,
})

function Page() {
  return <Landing language="en" extras={Route.useLoaderData()} />
}
