import { createFileRoute } from '@tanstack/react-router'
import { LocalPage } from '@/components/LocalPage'
import { localSeoHead } from '@/lib/content'

export const Route = createFileRoute('/haifa')({
  head: () => localSeoHead('haifa'),
  component: () => <LocalPage pageKey="haifa" />,
})
