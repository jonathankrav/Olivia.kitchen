import { createFileRoute } from '@tanstack/react-router'
import { Landing } from '@/components/Landing'
import { seoHead } from '@/lib/content'

export const Route = createFileRoute('/')({
  head: () => seoHead('en'),
  component: () => <Landing language="en" />,
})
