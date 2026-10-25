# Olivia Kitchen — Project Guide

## Architecture

This is a single-page private-chef marketing website, built with TanStack Start, React 19, TypeScript, and Vite and deployed on Vercel through the Nitro plugin. It is not an ecommerce application. There is no runtime AI, authentication, or custom database.

## Key directories

- `src/components/Landing.tsx`: the complete landing page, mobile navigation, gallery filtering (all / starters & mains / desserts), gallery lightbox, and inquiry form. It takes a `language` prop.
- `src/routes/index.tsx` (Hebrew), `en.tsx`, `ru.tsx`: one route per language (`/` (Hebrew, default), `/en`, `/ru`), each rendering `Landing` with its own SEO head from `seoHead` in `src/lib/content.ts`. The language switcher links between these routes.
- `src/components/Sections.tsx`: shared kashrut, service-area and FAQ sections used by the landing page and the Hebrew local pages.
- `src/components/LocalPage.tsx` and the local routes `haifa.tsx`, `north.tsx` (Hebrew: `/haifa`, `/north`), `en_.haifa.tsx`, `en_.north.tsx` (`/en/haifa`, `/en/north`), `ru_.haifa.tsx`, `ru_.north.tsx` (`/ru/haifa`, `/ru/north`): local SEO pages in three languages, each with its head from `localSeoHead(key, language)`. The `_` after `en`/`ru` keeps them from nesting under the landing routes. Copy lives in `localPages` in `src/lib/content.ts`; keep the six sitemap entries in step with it.
- `src/routes/kniga.tsx`, `src/components/RecipeBook.tsx`, `src/lib/book.ts`, `src/lib/book-types.ts`, `src/server/book-auth.ts`, `src/server/book-data.ts`: private illustrated recipe book at `/kniga` for the owner only. The password is the `RECIPE_BOOK_PASSWORD` environment variable on Vercel and never goes in code. `book.ts` holds server functions (login, logout, read) that check an HMAC-signed httpOnly cookie, and `book-data.ts` (recipes and hand-drawn SVG illustrations as strings) is only imported dynamically inside those handlers so it stays out of the client bundle. The route is `noindex`, has no link, and stays out of the sitemap and robots.txt. Recipes are added by the owner through the assistant; each recipe needs its own bright watercolor-and-ink SVG illustration in the same style.
- `src/routes/__root.tsx`: HTML shell, stylesheet import, favicon, and `lang`/`dir` derived from the path. Do not add an Open Graph image; the hosting platform supplies it.
- `public/robots.txt`, `public/sitemap.xml`: search engine files; update the sitemap when adding a route, and keep its image list for `/` in step with `galleryPhotos` and its `video:video` entries in step with `videoClips`.
- `src/lib/content.ts`: all English, Hebrew, and Russian copy plus email and WhatsApp configuration.
- `src/styles.css`: responsive editorial design, olive/cream theme tokens, typography, RTL handling, motion, and reduced-motion preferences.
- `public/img/`: real photographs of Olivia's dishes (webp only), processed to the site style with the photographer's JonathanKrav mark in the bottom-right corner. Gallery files come in a full size and a `-sm` size; `hero`, `israeli`, `italian` and `azerbaijani` are the hero and cuisine-card crops. The gallery list, groups (`savoury`, `desserts`) and per-language captions live in `galleryPhotos` in `src/lib/content.ts`. Images are served as static files from `/img/`.
- `scripts/generate-images.mjs`: optional, manually invoked static-image generation utility using Netlify AI Gateway. Never run during a build.

## Conventions

Use typed React functions and hooks, descriptive names, and type-only imports where applicable. Keep the English, Hebrew, and Russian copy objects aligned. Hebrew sets document `lang` and `dir`; use CSS logical properties where layout should follow language direction. The brand wordmark stays in Latin characters.

Maintain the cream, olive, and warm photographic design. Prefer existing CSS tokens and semantic components over adding dependencies. Support keyboard focus, native dialog dismissal, native form validation, and reduced-motion preferences.

## Contact handling

The inquiry form posts JSON to FormSubmit (`https://formsubmit.co/ajax/<contact.email>`) from `handleSubmit`. Preserve the `_honey` honeypot and the `_subject` hidden input. FormSubmit sends an activation email to `chef@olivia.kitchen` on the first submission, so do not claim email delivery works before the owner has activated it and a test inquiry has arrived. Do not store inquiries in local files or client-side state as persistence.

`contact.phone` and `contact.phoneE164` hold the call number supplied by the owner, shown in the contacts section and footers and used for the `tel:` links and structured data. `contact.whatsappNumber` holds the number supplied by the owner; the chat link strips non-digits before building the `wa.me` URL. Never invent a telephone number, service location, chef portrait, or client testimonial.

## Branches and environments

`main` is production (olivia.kitchen, deployed by Vercel). `test` is the working branch and is served at olivia-kitchen-test.vercel.app. Make changes in `test`, review them there, and merge to `main` only after the owner approves.

## Workflow

Use pnpm for dependency management. Local development is `pnpm dev`. During agent-runner tasks, do not run build, dev-server, TypeScript-check, or test commands; automatic deployment validates the project. Never inspect `.git` or print credentials. No inline code comments unless requested.

- Contact form notifications: the form sends the request to formsubmit (email) and, in parallel, to the notifyRequest server fn in src/lib/notify.ts, which messages Telegram via src/server/telegram.ts. Env vars TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set only by the owner in Vercel; never put them in code or chat. Without them the notification is silently skipped.

- Private page /orders (src/routes/orders.tsx, src/components/Orders.tsx): order history with status, cost, revenue, auto profit, two notes fields and a hand-written .xlsx export (src/lib/xlsx.ts, no dependencies). Storage is Upstash Redis over REST (env KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN); password is ORDERS_PASSWORD, falling back to RECIPE_BOOK_PASSWORD. The page is noindex, unlinked and not in the sitemap. Site form submissions are saved by notifyRequest in src/lib/notify.ts.
