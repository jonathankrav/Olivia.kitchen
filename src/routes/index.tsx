import { createFileRoute } from '@tanstack/react-router'
import { Landing } from '@/components/Landing'
import { seoHead } from '@/lib/content'

export const Route = createFileRoute('/')({
  head: () => seoHead('he'),
  component: () => <Landing language="he" />,
})
