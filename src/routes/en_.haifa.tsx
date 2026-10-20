import { createFileRoute } from '@tanstack/react-router'
import { LocalPage } from '@/components/LocalPage'
import { localSeoHead } from '@/lib/content'

export const Route = createFileRoute('/en_/haifa')({
  head: () => localSeoHead('haifa', 'en'),
  component: () => <LocalPage pageKey="haifa" language="en" />,
})
