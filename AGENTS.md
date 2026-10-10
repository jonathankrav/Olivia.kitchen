# Olivia Kitchen — Project Guide

## Architecture

This is a single-page private-chef marketing website, built with TanStack Start, React 19, TypeScript, and Vite and deployed on Netlify. It is not an ecommerce application. There is no runtime AI, authentication, or custom database.

## Key directories

- `src/routes/index.tsx`: the complete landing page, mobile navigation, language switching, cuisine filtering, gallery lightbox, and inquiry form.
- `src/routes/__root.tsx`: HTML shell, stylesheet import, favicon, and product-specific sharing metadata. Do not add an Open Graph image; the hosting platform supplies it.
- `src/lib/content.ts`: all English, Hebrew, and Russian copy plus email and WhatsApp configuration.
- `src/styles.css`: responsive editorial design, olive/cream theme tokens, typography, RTL handling, motion, and reduced-motion preferences.
- `public/img/`: four generated illustrative food images. Use Netlify Image CDN URLs for all image displays.
- `public/__forms.html`: static hidden Netlify form required for build-time detection in an SSR application.
- `scripts/generate-images.mjs`: optional, manually invoked static-image generation utility using Netlify AI Gateway. Never run during a build.
- `.netlify/features/netlify-forms`: feature activation marker created by the Netlify Forms skill.

## Conventions

Use typed React functions and hooks, descriptive names, and type-only imports where applicable. Keep the English, Hebrew, and Russian copy objects aligned. Hebrew sets document `lang` and `dir`; use CSS logical properties where layout should follow language direction. The brand wordmark stays in Latin characters.

Maintain the cream, olive, and warm photographic design. Prefer existing CSS tokens and semantic components over adding dependencies. Support keyboard focus, native dialog dismissal, native form validation, and reduced-motion preferences.

## Contact handling

`chef-inquiry` is managed by Netlify Forms. The React form must POST URL-encoded data to `/__forms.html`, not `/`, because the SSR handler would intercept root requests. Keep every field mirrored in the static form skeleton. Preserve the `form-name` hidden input and `bot-field` honeypot. Do not store inquiries in local files or client-side state as persistence.

Form detection was enabled. Email notification creation was rejected by the API with `Unauthorized`, so the project owner must configure notification delivery to `chef@olivia.kitchen` in Netlify. Do not claim email delivery works before it is configured and verified.

The user did not supply a WhatsApp number. `contact.whatsappNumber` is intentionally empty; until populated, the button opens an honest email/request-reply fallback with a WhatsApp share link. Once supplied, store the country-code-inclusive digits-only number in this setting. Never invent a telephone number, service location, chef portrait, or client testimonial.

## Workflow

Use pnpm for dependency management. Local development is `pnpm dev` or `netlify dev --port 8889`. During agent-runner tasks, do not run build, dev-server, TypeScript-check, or test commands; automatic deployment validates the project. Never inspect `.git` or print credentials. No inline code comments unless requested.
