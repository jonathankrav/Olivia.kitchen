import { createFileRoute } from '@tanstack/react-router'
import { LocalPage } from '@/components/LocalPage'
import { localSeoHead } from '@/lib/content'

export const Route = createFileRoute('/north')({
  head: () => localSeoHead('north', 'he'),
  component: () => <LocalPage pageKey="north" language="he" />,
})
