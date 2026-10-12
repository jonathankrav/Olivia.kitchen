import { createFileRoute } from '@tanstack/react-router'
import { Landing } from '@/components/Landing'
import { seoHead } from '@/lib/content'

export const Route = createFileRoute('/ru')({
  head: () => seoHead('ru'),
  component: () => <Landing language="ru" />,
})
