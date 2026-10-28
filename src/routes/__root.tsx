import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: 'icon', href: '/favicon.ico?v=3', sizes: '48x48' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=3', sizes: 'any' },
      { rel: 'icon', type: 'image/png', href: '/favicon-192.png?v=3', sizes: '192x192' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=3' },
    ],
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: state => state.location.pathname })
  const privateBook = pathname.startsWith('/kniga') || pathname.startsWith('/orders')
  const language = privateBook ? 'ru' : pathname.startsWith('/en') ? 'en' : pathname.startsWith('/ru') ? 'ru' : 'he'
  return (
    <html lang={language} dir={language === 'he' ? 'rtl' : 'ltr'}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {!privateBook && <script dangerouslySetInnerHTML={{ __html: 'window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)}' }} />}
        {!privateBook && <script defer src="/_vercel/insights/script.js" />}
        <Scripts />
      </body>
    </html>
  )
}
