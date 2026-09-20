# /quote page — setup instructions

Drop these files into `frontend/src/` at matching paths. Three files replace
existing ones (`router/index.js`, `components/layout/SiteHeader.vue`,
`components/layout/SiteFooter.vue`) — diff them against your current
versions before overwriting, since I built these from what you pasted me and
haven't seen any changes made since.

## Update from the previous version of this drop

The Lead Prosper integration is now built against the real, verified API
spec (you sent the actual spec page — thank you), not a guess. What changed
in `leadProsper.service.js`:

- The three campaign-identifying fields are hardcoded constants, verified
  correct: `lp_campaign_id: "36656"`, `lp_supplier_id: "129382"`,
  `lp_key: "oj7puzllvc10vq"`. No env var needed for these anymore — they're
  not secrets, they just identify which campaign a post belongs to.
- `phone` is sent as 10 raw digits (`2102153258`), not formatted — Lead
  Prosper's spec requires that exact shape.
- `zip_code` is sent as a JSON number, matching their example payload.
- Added `tcpa_text` (the exact consent copy shown to the user, as
  compliance evidence), `user_agent`, and `landing_page_url` — all optional
  per the spec but free to include and worth having.
- The submit handler now reads Lead Prosper's actual response shape
  (`{ status: 'ACCEPTED' | 'DUPLICATED' | 'ERROR', ... }`) rather than just
  checking for an HTTP error — their API returns 200-range responses even
  for a rejected lead, so the real signal is the `status` field.

## Newest changes: TrustedForm, IP address, URL param passthrough

Three new pieces, all in this drop:

**1. TrustedForm.** Added `useTrustedForm.js`, a new composable. Because
`/quote` is a Vue SPA (not a static HTML page with one `</body>`), the
TrustedForm loader script can't just sit as a static tag near the end of
the page the way your snippet assumed — the contact-step `<form>` it needs
to scan for doesn't exist in the DOM until the user reaches the last step
(it's behind a `v-else-if` in `QuoteWizard.vue`). So the script is injected
programmatically the first time that step's form actually mounts (a
`watch` on the current step in `useQuoteForm.js`), and the resulting
`xxTrustedFormCertUrl` hidden field's value is read off that form at submit
time and sent as Lead Prosper's `trustedform_cert_url`. The `<noscript>`
fallback pixel is a static tag at the top of `QuoteWizard.vue`, same as a
plain HTML page would have it.

One flag: I rebuilt this using the standard ActiveProspect TrustedForm
loader with the exact query params you gave me
(`field=xxTrustedFormCertUrl&use_tagged_consent=true`), not a byte-for-byte
copy of what you pasted — that text didn't survive a context handoff on my
end. Please diff `useTrustedForm.js`'s `injectTrustedFormScript()` against
the literal snippet in your TrustedForm account dashboard before this goes
live; if your account uses a different loader version or an extra
account-specific parameter, swap the `src` string to match exactly.
Consent-tracking scripts are worth getting byte-perfect.

**2. IP address.** Added `useClientIp.js`. Browsers don't expose a client's
public IP to page JS directly, so this calls `api.ipify.org` (free, no API
key, CORS-enabled) as soon as the wizard mounts, well before the user
reaches the final step. If that lookup fails or times out, submission just
proceeds without `ip_address` — it's optional on Lead Prosper's side, so
nothing blocks on it.

**3. URL parameter passthrough.** `leadProsper.service.js` now reads every
`?key=value` pair off the current page URL and merges them into the Lead
Prosper payload — so a link like
`/quote?lp_subid1=123&sub2=9302383&fbclickid=20394932423` sends exactly
those three keys/values in the POST body, verbatim. Precedence: a URL param
overrides the hardcoded `lp_subid1: 'quote-wizard'` default (so an ad
platform's own subid wins), but URL params can never override
`lp_campaign_id`/`lp_supplier_id`/`lp_key` — those are re-asserted last in
the payload regardless of what's in the query string, so a crafted link
can't redirect leads to a different campaign.

`landing_page_url`, `user_agent`, and `tcpa_text` were already wired up in
the previous drop and are unchanged — verify they're still present in
`leadProsper.service.js` if you're diffing rather than replacing the whole
file.

## ⚠️ This campaign is in Lead Prosper's TEST MODE

The spec page you sent has this banner at the top: **"THIS CAMPAIGN IS
CURRENTLY IN TEST MODE — Please contact your account manager after you've
sent a successful test."** This isn't something to fix in code — it's a
setting on the campaign in your Lead Prosper account. Before pointing real
traffic at `/quote`:

1. Submit a real test lead through the built page.
2. Confirm it shows up in Lead Prosper (as a test lead).
3. Flip the campaign out of test mode / confirm with your account manager.

## 1. One manual edit I couldn't make blind

I don't have `router/constants.js`, so I couldn't safely rewrite it without
risking breaking every other route. Open it and add one line to the
`ROUTES` object, following whatever casing convention the existing keys
use, e.g.:

```js
export const ROUTES = {
  // ...existing keys...
  QUOTE: 'quote',
}
```

## 2. Environment variables

Only one now — Google Maps is the sole optional piece left:

```
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key-here
```

Without it, the address step still works as plain manual text inputs
(address/city/state) — autocomplete just doesn't activate. When you do set
one up: enable the **Places API** on that key's Google Cloud project, and
restrict the key by HTTP referrer to `ardenroofing.com/*`.

## 3. Content substitutions I made on purpose

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
  company. I left this out entirely rather than invent Arden-specific
  compliance language — the TCPA text (used verbatim from your spec doc)
  already establishes that this form shares data with "Home Improvement
  Partners," so there may be a real marketplace disclaimer Arden needs
  here too. Worth a quick pass by whoever handles your TCPA/lead-gen
  compliance before this goes live with real traffic.

## 4. Optional fields not wired up

`trustedform_cert_url` and `ip_address` are now wired up (see the section
above). Lead Prosper's spec also accepts `jornaya_leadid`, `property_type`,
`date_of_birth`, and `gender` — none of these are in Arden's spec doc's
question flow, so they're still not collected or sent. `jornaya_leadid`
in particular is worth revisiting if any Lead Prosper buyers on this
campaign specifically require Jornaya (as distinct from TrustedForm)
consent tracking — that would need its own separate script snippet, same
shape as the TrustedForm one, if you get that requirement from them.

## 5. Nav links added

I added a "Get a Free Quote" link to both `SiteHeader.vue` (next to the
existing "Get an Estimate" link) and `SiteFooter.vue`'s Quick Links,
pointing at the new route. I left the existing `/estimate` link and page
untouched — you now have two lead-capture entry points side by side. Worth
deciding later whether that's intentional (e.g. different traffic sources)
or whether one should be consolidated/removed.

## 6. Build & verify

No `vite.config.js` changes needed — `/quote` is a static route like
`/contact` or `/estimate`, so vite-ssg should prerender it automatically.

```bash
cd frontend
npm run build
npm run preview
# then check:
#   - /quote loads with your header/footer
#   - each step advances and Back works
#   - zip/phone/email validation actually blocks bad input
#   - a real test submission shows ACCEPTED in Lead Prosper
```
