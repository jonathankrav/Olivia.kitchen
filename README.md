# Olivia Kitchen

A warm, editorial-style single-page website for private chef Olivia, celebrating Israeli, Italian, and Azerbaijani cuisine. The site includes English, Hebrew, and Russian content, an interactive gallery, and a private-dining inquiry form.

## Technologies

TanStack Start, React 19, TypeScript, Vite, custom CSS with Tailwind CSS 4, and Lucide icons. Netlify Forms handles submissions and spam protection; Netlify Image CDN delivers resized WebP images. Four illustrative culinary images were generated through Netlify AI Gateway using Gemini. No runtime AI or separate database is needed.

## Local development

Use Node.js 22 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

For Netlify feature emulation, use `netlify dev --port 8889`. Forms processing is available on a deployed Netlify site; a plain Vite server does not accept Netlify Forms submissions. The Netlify pipeline runs the configured production build.

## Content and contact details

All three languages and contact configuration live in `src/lib/content.ts`. English is the initial language; Hebrew switches the document to right-to-left layout. No service area was specified, so the site does not claim one.

The contact email is `chef@olivia.kitchen`. Olivia’s WhatsApp number was not supplied. Set `contact.whatsappNumber` to the international number, using digits only, to activate the direct WhatsApp chat link. Until then, the WhatsApp button offers email contact, explains how to request a WhatsApp reply in the form, and provides a working WhatsApp sharing link. It does not pretend to open a conversation with Olivia.

## Email notifications — required setup

Forms detection was enabled for deployment. After the first deploy, check that `chef-inquiry` appears in Netlify Forms. Add a form submission email notification to `chef@olivia.kitchen` under **Project configuration → Notifications → Emails and webhooks → Form submission notifications**. Select the `chef-inquiry` form or all forms. The form’s `email` field provides the reply-to address.

Automatic notification configuration was attempted, but the Netlify API rejected creation with `Unauthorized`. Submissions can still be stored in Netlify Forms; **email delivery is not configured until the notification is added**. Send a genuine inquiry after deployment to verify capture and email delivery.

## Images

Illustrative imagery lives in `public/img/` and is clearly identified as illustrative in the gallery. All displayed imagery is requested through `/.netlify/images` rather than loading full-resolution PNG files. `scripts/generate-images.mjs` was used to create these static assets. Regeneration requires Netlify AI Gateway access and incurs inference usage; it is not part of development or deployment. 
