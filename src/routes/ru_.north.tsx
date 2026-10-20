import { createFileRoute } from '@tanstack/react-router'
import { LocalPage } from '@/components/LocalPage'
import { localSeoHead } from '@/lib/content'

export const Route = createFileRoute('/ru_/north')({
  head: () => localSeoHead('north', 'ru'),
  component: () => <LocalPage pageKey="north" language="ru" />,
})
