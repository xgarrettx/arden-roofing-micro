# Arden Roofing — rebuilt from `files/arden-roofing-site-html`

This is the plain-HTML microsite in `files/arden-roofing-site-html/` rebuilt as a real
app: a Vue 3 frontend and a NestJS + MySQL backend, following
`files/backend-guidelines-light.md` and `files/FRONTEND_GUIDELINES_PERSONAL.md`. The
original static site is left untouched as a content reference — nothing here overwrites it.

```
arden-roofing-micro/
├── files/                        # original static site + the two guideline docs (untouched)
├── backend/                      # NestJS + TypeORM + MySQL API
└── frontend/                     # Vue 3 + Vite + vue-router + Pinia + PrimeVue, prerendered with vite-ssg
```

## Why this isn't a 1:1 application of the guidelines

Both guideline docs are written for an authenticated SaaS app (session auth, Redis, a
Vue SPA behind a login). This project is a ~55-page **local-SEO lead-gen microsite** —
35 town-specific landing pages that need to rank in Google, plus two lead forms. A few
decisions were made explicitly before writing any code (see the chat for the full
reasoning) and are worth restating here:

1. **Prerendering, not a pure client-rendered SPA.** A plain Vue Router SPA renders its
   content in the browser, which risks Google not seeing each town page's unique copy
   and meta tags on crawl — a real problem when those pages are the entire point of the
   site. `frontend/` still uses Vue 3 + Vite + vue-router + Pinia + PrimeVue exactly as
   the guidelines describe, but swaps the guidelines' plain `createApp().mount()`
   bootstrap for **`vite-ssg`**, which renders every route (including all 35 location
   pages and 3 service pages, enumerated dynamically from the API — see
   `vite.config.js`'s `ssgOptions.includedRoutes`) to real static HTML at build time.
   `@unhead/vue` (via `src/composables/useSeoMeta.js`) sets a unique `<title>`, meta
   description, canonical URL, and JSON-LD graph per page. This is the one structural
   deviation from the frontend guidelines' setup steps — everything else (folder
   layout, Pinia, the service-layer pattern, PrimeVue/PrimeFlex, Vuelidate, vue-request,
   event buses) follows them as written.

2. **The backend is scoped to "light CMS" + leads, not a full app.** The guidelines'
   auth/session/Passport/Redis patterns aren't used — there's no login-gated area on
   this site. If an admin dashboard for managing leads or content is ever wanted, that
   auth pattern is exactly what the backend guidelines already describe; it just isn't
   needed yet, so nothing was built preemptively. `decimal.js` (for money) also isn't
   used since nothing here computes currency — the roofing cost ranges on the service
   pages are just display strings, ported from the original copy.

3. **CMS scope**: per your call, the database backs **locations** (all 35 town pages),
   **services** (the 3 service detail pages), and **team** (the 3 team bios) — the
   content you named. Legal pages, About, Careers, FAQ, and the Home/Contact/Estimate
   page framing stayed as ported static content in the frontend (`frontend/src/data/*.json`,
   extracted from the original HTML) rather than new DB tables, since editing those is
   rare and they weren't part of what you asked to be CMS-backed. Rich per-page content
   (paragraphs, feature-card lists, cost tables, process steps) is stored as **JSON
   columns** on the `locations`/`services` entities rather than normalized into a table
   per list — a deliberate simplification versus the guidelines' usual one-column-per-field
   entity pattern, since this content is always read and written as a whole page, never
   queried by sub-field.

## Where the content came from

Nothing here was rewritten from scratch. A Python/BeautifulSoup script parsed all 55
pages in `files/arden-roofing-site-html/` and extracted the real, already-written copy —
every town page's actual paragraphs (not a generic template with the city name swapped
in), the 3 service pages' full structure (highlights, cost tables, process steps), the
3 team bios, the FAQ, and the legal/about/careers pages — into:

- `backend/src/database/seeds/data/*.json` — feeds the `npm run seed` script (see below)
- `frontend/src/data/*.json` — the static (non-CMS) page content

One fix made during extraction: the original `<title>` tags were double-HTML-escaped
("Roofing Replacement &amp;amp; Repair…"); titles here are the corrected single-escaped
form.

## URL structure changed — redirects are included

The original site's URLs were flat (`/roofing-replacement-and-repair-in-arden.html`).
The rebuilt site uses `/service-areas/arden`, `/services/repair`, `/legal/privacy-policy`,
etc. — normal nested routes. **If this ever replaces the live site, the URL change alone
would drop 35+ pages' existing Google rankings and any inbound links** unless every old
URL 301-redirects to its new path. `frontend/public/_redirects` has all 54 mappings
already generated, in Netlify/Cloudflare Pages format; port them into `vercel.json` or
nginx `rewrite` rules if you deploy elsewhere.

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env        # point DB_* at a local MySQL instance; create the DB first
npm install
npm run migration:run       # creates locations / services / team_members / leads tables
npm run seed                # loads the extracted content into locations/services/team
npm run start:dev           # http://127.0.0.1:3001
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # VITE_API_URL should point at the backend above
npm install
npm run dev                 # http://127.0.0.1:3000 — normal SPA dev server, no prerender
```

### 3. Production build (prerendered)

The backend must be running and seeded — the build fetches real content from it for
every page, and the location/service route list itself comes from `GET /locations` and
`GET /services`.

```bash
cd backend && npm run start:dev &     # or a deployed API, via VITE_API_URL
cd frontend && npm run build          # vite-ssg build, then writes dist/sitemap.xml + robots.txt
npm run preview                       # sanity-check the static output locally
```

`dist/` is a folder of real static HTML files (one per route) plus the client JS bundle
that hydrates them — deployable to any static host (Netlify, Cloudflare Pages, S3+CDN,
etc.), with `_redirects` already in place for Netlify/Cloudflare.

## Leads

`POST /leads` (validated `CreateLeadDto`) stores every Contact/Estimate submission in
the `leads` table. There's no email/SMS provider wired up yet — `LeadService.create`
logs the new lead and has a clear comment marking where to add one (Postmark, SES,
Twilio, etc.) once you pick a provider.

## Build verification

The frontend production build (`npm run build`, i.e. `vite-ssg build`) was run end-to-end
against a mock API serving the real extracted content, and produced all 54 expected static
pages (home, about, careers, services index + 3 service pages, service-areas index + 35
town pages, contact, estimate, thank-you, faq, team, 6 legal pages) with no errors. Three
real bugs turned up during that verification and were fixed:

1. **Location/service/team/home pages were rendering with empty `<main>` content.**
   `useRequest(..., { manual: true })` from vue-request returns two trigger functions —
   `run` (fire-and-forget, no promise) and `runAsync` (returns a promise, rejects on
   error). Every page was calling `run` but `await`-ing it as if it were `runAsync`, so
   the top-level `await` resolved before the actual HTTP request finished and the page
   rendered before its data arrived. Fixed by switching every data-loading call (in
   `HomePage`, `LocationPage`, `ServiceDetailPage`, `ContactPage`, `TeamPage`,
   `ServiceAreasPage`, and the lead-submission call in `useLeadForm.js`) to `runAsync`.
   This also fixed a real functional bug in lead submission: the Contact/Estimate forms
   were checking `submitError` immediately after an `await` that didn't actually wait,
   so a failed submission could still route to the thank-you page.

2. **Dead `:citySlug.html` / `:serviceSlug.html` / `:legalSlug.html` files, and no legal
   pages at all.** `vite.config.js`'s `includedRoutes` merged the API-enumerated concrete
   paths into vite-ssg's *default* path list — which already contains the router's raw
   dynamic-segment patterns (literally `/service-areas/:citySlug`, etc.) — instead of
   replacing them. Prerendering the literal pattern also fired a real API request for the
   literal string `:citySlug`, which 404'd. It also never enumerated the 6 `/legal/*`
   routes at all, so no legal pages were built. Fixed by filtering out any path containing
   `:` before merging, and adding the legal routes from `src/data/articles.json`.

3. **JSON-LD structured data wasn't in the page.** `useSeoMeta.js` set the script tag's
   content via `children: JSON.stringify(graph)` — `@unhead/vue`'s schema has no
   `children` key for scripts, so it was written out as a literal (and useless)
   `children="..."` HTML attribute instead of the tag's text content. Fixed to
   `innerHTML`, which is `@unhead`'s documented key for a tag's raw content. Verified
   afterward that every page's `<script type="application/ld+json">` now contains valid,
   parseable JSON with the expected `@type` nodes.

A smaller cleanup alongside these: the three dynamic routes had `props: true` set but
none of their pages actually declared the prop (they all read `route.params` directly),
which let the raw slug fall through onto the DOM as a stray attribute on the legal pages
(`legalslug="privacy-policy"`). Removed `props: true` from all three routes.

Not verified in this environment: the backend's migrations and seed script are
type-checked and compiled cleanly, but were never run against a live MySQL instance (none
was available here) — run `npm run migration:run && npm run seed` against a real database
before relying on the CMS content.

## What would come next

- An admin view of `leads` (and a login for it) — the backend guidelines' auth/session
  pattern is the natural fit whenever that's wanted.
- A transactional-email provider wired into `LeadService`.
- If the location/service page template ever needs a genuinely different section (not
  just different text in the existing sections), that's a schema change to the
  `locations`/`services` entities + a migration, same as any other TypeORM change.
