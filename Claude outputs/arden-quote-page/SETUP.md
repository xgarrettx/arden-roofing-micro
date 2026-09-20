# /quote page — setup instructions

Drop these files into `frontend/src/` at matching paths (they mirror the real
paths already — `pages/QuotePage.vue`, `components/quote/QuoteWizard.vue`,
etc.). Two files replace existing ones (`router/index.js`,
`components/layout/SiteHeader.vue`, `components/layout/SiteFooter.vue`) —
diff them against your current versions before overwriting, since I built
these from what you pasted me and haven't seen any changes made since.

## 1. One manual edit I couldn't make blind

I don't have `router/constants.js`, so I couldn't safely rewrite it without
risking breaking every other route. Open it and add one line to the `ROUTES`
object, following whatever casing convention the existing keys use, e.g.:

```js
export const ROUTES = {
  // ...existing keys...
  QUOTE: 'quote',
}
```

## 2. Environment variables

Add to `frontend/.env` (and `.env.example` with placeholder values):

```
VITE_LEAD_PROSPER_CAMPAIGN_KEY=your-campaign-key-here
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key-here
```

- **`VITE_LEAD_PROSPER_CAMPAIGN_KEY`** — required. Without it, the submit
  step throws immediately instead of posting a request with an empty key.
- **`VITE_GOOGLE_MAPS_API_KEY`** — optional. Without it, the address step
  still works as plain manual text inputs (address/city/state) — autocomplete
  just doesn't activate. When you do set one up: enable the **Places API**
  on that key's Google Cloud project, and restrict the key by HTTP referrer
  to `ardenroofing.com/*` (it's used client-side, so it's public either way,
  but referrer restriction stops it being used from other sites).

Both are `VITE_`-prefixed because the wizard posts to Lead Prosper directly
from the browser (per your original ask), so both keys are necessarily
public in the shipped JS bundle — same as any client-side lead-gen widget.
If you'd rather the Lead Prosper key stay server-side, that's a different
architecture (browser posts to our own backend, backend relays to Lead
Prosper with a secret key) — say the word and I'll rework it that way
instead.

## 3. Confirm before relying on this in production

**The Lead Prosper field name is my best guess, not verified.** I could not
fetch your API spec (`api.leadprosper.io/api-specs?hash=...` is blocked by
robots.txt for my fetch tool), so I used `key` as the top-level
campaign-identifying JSON field in
`frontend/src/services/leads/leadProsper.service.js` — that's the common
Lead Prosper direct-post convention, but you built this platform, so you'll
know in five seconds whether that's actually right for this campaign. It's
the only field name in that file that might need to change. Test with a
real submission and check the lead lands in your Lead Prosper campaign
before trusting this live.

## 4. Two content substitutions I made on purpose

- **Trust badges**: the reference screenshots show "DigiCert Secured",
  "Safe Shopping", and similar third-party certification seals. I didn't
  reproduce those — Arden Roofing doesn't actually hold those specific
  certifications, and displaying them would be a false claim. I used a
  plain lock-icon + "100% secure & confidential" line instead, which is
  accurate (the site is TLS-encrypted). If you do hold any of those
  certifications for real, let me know and I'll add the genuine badge back.
- **Marketplace disclaimer**: the reference design includes boilerplate
  like "This Website is an advertising marketplace... we are not a
  provider, manufacturer, or installer," attributed to a specific other
  company ("The Boroughs Media"). I left this out entirely rather than
  invent Arden-specific compliance language — the TCPA text in your spec
  doc (which I did use verbatim) already establishes that this form shares
  data with "Home Improvement Partners," so there may be a real marketplace
  disclaimer Arden needs here too. That's a compliance decision, not a
  design one — worth a quick pass by whoever handles your TCPA/lead-gen
  compliance before this goes live with real traffic.

## 5. Nav links added

I added a "Get a Free Quote" link to both `SiteHeader.vue` (next to the
existing "Get an Estimate" link) and `SiteFooter.vue`'s Quick Links,
pointing at the new route. I left the existing `/estimate` link and page
untouched — you now have two lead-capture entry points side by side. Worth
deciding later whether that's intentional (e.g. different traffic sources)
or whether one should be consolidated/removed.

## 6. Build & verify

No `vite.config.js` changes needed — `/quote` is a static route like
`/contact` or `/estimate`, so vite-ssg should prerender it automatically
without touching the dynamic-route enumeration logic.

```bash
cd frontend
npm run build
npm run preview
# then check:
#   - /quote loads with your header/footer
#   - each step advances and Back works
#   - zip/phone/email validation actually blocks bad input
#   - a real test submission shows up in your Lead Prosper campaign
```
