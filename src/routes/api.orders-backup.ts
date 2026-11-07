import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/orders-backup')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET
        if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
          return new Response('Unauthorized', { status: 401 })
        }
        try {
          const { runOrdersBackup } = await import('@/server/orders-backup')
          const result = await runOrdersBackup()
          return Response.json(result, { headers: { 'Cache-Control': 'no-store' } })
        } catch {
          return Response.json({ ok: false }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
        }
      },
    },
  },
})
