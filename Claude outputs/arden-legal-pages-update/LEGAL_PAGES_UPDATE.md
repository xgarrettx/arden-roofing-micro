# Legal pages + tracking scripts — what changed

Everything here plugs into the existing site structure (`articles.json` +
`LegalPage.vue` + `ArticleContent.vue`, all unchanged) — no new components
needed, since the California Privacy page reuses the same `/legal/:slug`
renderer as the others.

## Files in this drop

- `frontend/src/data/articles.json` — **replace your existing file.**
  Updated `privacy-policy`, `terms-conditions`, and
  `referral-marketing-disclosure` entries with the content from your docx
  files; added a new `california-privacy` entry. Every other entry (about,
  careers, disclaimer, accessibility, complaints-policy) is untouched —
  I copied them through as-is so this is a safe drop-in replacement, not a
  merge you have to do by hand.
- `frontend/src/components/layout/SiteFooter.vue` — added "California
  Privacy Rights" to the Information column, linking to
  `/legal/california-privacy`.
- `frontend/index.html` — added both `<head>` scripts (see below).

## Things I changed from your docx text, and why

These docs read like they started life as another company's ("RoofUpgrade")
boilerplate — a few leftovers made that obvious, and I didn't think you'd
want them shipped to a live legal page as-is:

1. **Broken self-reference links.** The Terms and Privacy docs linked back
   to `roofupgrade.com/privacy.html`, `/terms.html`, and `/ccpa.html` — not
   your domain. I repointed all of these to your real pages
   (`/legal/privacy-policy`, `/legal/terms-conditions`,
   `/legal/california-privacy`).
2. **A typo:** "unsubscribe instARctions" in the Privacy doc — looks like a
   find-and-replace artifact (swapping some placeholder abbreviation for
   "AR"). Fixed to "instructions."
3. **The Terms doc's "Short Code (Placeholder)" section** had a literal
   `(Placeholder)` where an SMS short code number was supposed to go, plus
   a long stock carrier list. I kept the STOP/HELP opt-out language (it
   matches the TCPA text already on your `/quote` page) but dropped the
   short-code-specific mechanics, since publishing "(Placeholder)" on a
   live compliance page would actively confuse anyone trying to text STOP.
   **If Arden runs an actual SMS short code program, send me the number and
   I'll add it back properly.**
4. **The numbered "Your Obligations" list skipped a number** (went 1, 2,
   then 4 — no 3 in the source doc). I rendered it as a clean ordered list
   of the three items actually present rather than reproducing the gap.

## Things I left exactly as your docx stated, worth a second look

I didn't touch these since they're substantive legal calls, not formatting
— but they stood out enough that you or whoever reviews this for Arden
should know about them before this goes live:

- **Governing law / arbitration venue.** The Terms doc says disputes are
  governed by **California** law with arbitration in **Los Angeles, CA**.
  Arden Roofing is a North Carolina LLC — worth confirming that's
  intentional (some companies do deliberately choose CA for arbitration
  reasons) rather than another leftover from the template.
- **Three different contact emails** across the docs: `support@` in Terms,
  `sales@` in Privacy, `info@` in the California rights doc. I kept each
  document's own stated address rather than unify them, since I don't know
  which inboxes Arden actually monitors.
- **No mailing address.** The Terms doc's "Contact Us" section ends with
  "write to us at: Arden Roofing LLC" and nothing after it — no street
  address. I dropped that trailing clause rather than publish a sentence
  that doesn't finish. Send me a mailing address if you want postal contact
  listed.

## The Partners page's link requirement

The paragraph "By using this site, you agree to the Terms and Conditions
and Privacy Policy of ArdenRoofing.com..." is now in the page's intro, with
"Terms and Conditions" → `https://ardenroofing.com/legal/terms-conditions`
and "Privacy Policy" → `https://ardenroofing.com/legal/privacy-policy`,
both `target="_blank"`, exactly as you asked.

The partner list itself has **1,203 companies** — that's a genuinely long
page. It renders as a plain list under "Marketing Partners List," same
typography as the rest of the article content, so it'll be readable, just
long. Worth knowing before it goes live.

## The two `<head>` scripts

Both are in `frontend/index.html` now — the Google tag as the first thing
after `<head>`, the tracking snippet as the last thing before `</head>`,
exactly where you asked for them in the static template.

One nuance worth a post-build check: your SEO composable
(`useSeoMeta.js`) uses `@unhead/vue` to inject each page's own
title/meta/canonical/JSON-LD during vite-ssg's prerender step, into this
same `<head>`. I don't have your `main.js`/vite-ssg config in front of me,
so I can't confirm exactly where in `<head>` unhead's injected tags land
relative to these two static scripts — it might insert its tags between
them rather than strictly before/after. Functionally this doesn't matter
(both scripts still load on every page either way), but if you care about
the Google tag being the literal first child of `<head>` for tag-timing
reasons, it's worth opening a built page in `dist/` after `npm run build`
and eyeballing the `<head>` order once.

## Build & verify

```bash
cd frontend
npm run build
npm run preview
# then check:
#   - /legal/terms-conditions, /legal/privacy-policy,
#     /legal/referral-marketing-disclosure show the new content
#   - /legal/california-privacy loads and matches the Privacy Policy page's formatting
#   - footer's Information column shows "California Privacy Rights" and links correctly
#   - view-source on a built page in dist/ to confirm both <head> scripts are present
```
