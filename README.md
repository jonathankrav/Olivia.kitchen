# Olivia’s Kitchen

A warm, editorial-style single-page website for private chef Olivia, celebrating Israeli, Italian, and Caucasian cuisine. The site includes English, Hebrew, and Russian content, an interactive gallery, and a private-dining inquiry form.

## Technologies

TanStack Start, React 19, TypeScript, Vite, custom CSS with Tailwind CSS 4, and Lucide icons. The site is deployed on Vercel through the Nitro plugin. FormSubmit delivers inquiries by email and filters spam with a honeypot field. Four illustrative culinary images were generated through Netlify AI Gateway using Gemini. No runtime AI or separate database is needed.

## Local development

Use Node.js 22 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Vercel runs `pnpm install --no-frozen-lockfile` and `vite build` using `vercel.json`. The `nitro` dependency is set to `latest`; run `pnpm add nitro --save-exact` to pin it and update the lockfile, then remove `installCommand` from `vercel.json`.

## Content and contact details

All three languages and contact configuration live in `src/lib/content.ts`. English is the initial language; Hebrew switches the document to right-to-left layout. No service area was specified, so the site does not claim one.

The contact email is `chef@olivia.kitchen`. Olivia’s WhatsApp number is stored in `contact.whatsappNumber`; the chat link strips every non-digit character, so a leading `+` is fine. If the number is emptied, the WhatsApp button falls back to email contact and a sharing link built from the current site address.

## Email delivery — required activation

Inquiries are sent from the browser to FormSubmit, which forwards them to `chef@olivia.kitchen`. The first submission makes FormSubmit send an activation email to that address; the link in it must be opened once before inquiries are delivered. After activation, send a genuine test inquiry and confirm it arrives. The form’s `email` field becomes the reply-to address.

## Images

Illustrative imagery lives in `public/img/` and is clearly identified as illustrative in the gallery. Images are served directly from `public/img/` as static PNG files. `scripts/generate-images.mjs` was used to create these static assets. Regeneration requires Netlify AI Gateway access and incurs inference usage; it is not part of development or deployment.
