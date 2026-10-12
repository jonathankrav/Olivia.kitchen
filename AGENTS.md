# Olivia Kitchen — Project Guide

## Architecture

This is a single-page private-chef marketing website, built with TanStack Start, React 19, TypeScript, and Vite and deployed on Vercel through the Nitro plugin. It is not an ecommerce application. There is no runtime AI, authentication, or custom database.

## Key directories

- `src/components/Landing.tsx`: the complete landing page, mobile navigation, cuisine filtering, gallery lightbox, and inquiry form. It takes a `language` prop.
- `src/routes/index.tsx`, `he.tsx`, `ru.tsx`: one route per language (`/`, `/he`, `/ru`), each rendering `Landing` with its own SEO head from `seoHead` in `src/lib/content.ts`. The language switcher links between these routes.
- `src/routes/__root.tsx`: HTML shell, stylesheet import, favicon, and `lang`/`dir` derived from the path. Do not add an Open Graph image; the hosting platform supplies it.
- `public/robots.txt`, `public/sitemap.xml`: search engine files; update the sitemap when adding a route.
- `src/lib/content.ts`: all English, Hebrew, and Russian copy plus email and WhatsApp configuration.
- `src/styles.css`: responsive editorial design, olive/cream theme tokens, typography, RTL handling, motion, and reduced-motion preferences.
- `public/img/`: four generated illustrative food images. Images are served as static files from `/img/`.
- `scripts/generate-images.mjs`: optional, manually invoked static-image generation utility using Netlify AI Gateway. Never run during a build.

## Conventions

Use typed React functions and hooks, descriptive names, and type-only imports where applicable. Keep the English, Hebrew, and Russian copy objects aligned. Hebrew sets document `lang` and `dir`; use CSS logical properties where layout should follow language direction. The brand wordmark stays in Latin characters.

Maintain the cream, olive, and warm photographic design. Prefer existing CSS tokens and semantic components over adding dependencies. Support keyboard focus, native dialog dismissal, native form validation, and reduced-motion preferences.

## Contact handling

The inquiry form posts JSON to FormSubmit (`https://formsubmit.co/ajax/<contact.email>`) from `handleSubmit`. Preserve the `_honey` honeypot and the `_subject` hidden input. FormSubmit sends an activation email to `chef@olivia.kitchen` on the first submission, so do not claim email delivery works before the owner has activated it and a test inquiry has arrived. Do not store inquiries in local files or client-side state as persistence.

`contact.whatsappNumber` holds the number supplied by the owner; the chat link strips non-digits before building the `wa.me` URL. Never invent a telephone number, service location, chef portrait, or client testimonial.

## Workflow

Use pnpm for dependency management. Local development is `pnpm dev`. During agent-runner tasks, do not run build, dev-server, TypeScript-check, or test commands; automatic deployment validates the project. Never inspect `.git` or print credentials. No inline code comments unless requested.
