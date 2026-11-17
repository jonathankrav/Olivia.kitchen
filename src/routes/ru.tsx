import { createFileRoute } from '@tanstack/react-router'
import { Landing } from '@/components/Landing'
import { seoHead } from '@/lib/content'
import { getMenuExtras } from '@/lib/menu-extras'

export const Route = createFileRoute('/ru')({
  head: ({ loaderData }) => seoHead('ru', loaderData),
  loader: () => getMenuExtras(),
  component: Page,
})

function Page() {
  return <Landing language="ru" extras={Route.useLoaderData()} />
}
