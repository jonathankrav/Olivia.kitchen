import { createFileRoute } from '@tanstack/react-router'
import { LocalPage } from '@/components/LocalPage'
import { localSeoHead } from '@/lib/content'

export const Route = createFileRoute('/en_/north')({
  head: () => localSeoHead('north', 'en'),
  component: () => <LocalPage pageKey="north" language="en" />,
})
