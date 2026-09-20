import axios from 'axios'

// Lead Prosper's direct_post endpoint is a separate, external API — it is
// NOT the Arden backend (see `@/services/api.service.js`), so this uses its
// own bare axios call rather than the shared `instance` used for /locations,
// /services, /leads, etc.
//
// Field spec verified directly against
// https://api.leadprosper.io/api-specs?hash=oj7puzllvc10vq (2026-09-20):
// required lp_campaign_id/lp_supplier_id/lp_key are fixed per-campaign
// constants (not secrets — they identify which campaign a post belongs to,
// same as any client-side lead-gen form), everything else is the mapped
// lead data. Two format quirks confirmed from their example payload:
// `phone` is 10 raw digits (no formatting), and `zip_code` is a JSON
// number, not a string.
const LEAD_PROSPER_URL = 'https://api.leadprosper.io/direct_post'

const LP_CAMPAIGN_ID = '36656'
const LP_SUPPLIER_ID = '129382'
const LP_KEY = 'oj7puzllvc10vq'

// NOTE: as of 2026-09-20 this campaign is in Lead Prosper's TEST MODE per
// the spec page's banner. Leads posted now are test leads only — send a
// successful test and confirm with your Lead Prosper account manager
// before this goes live to real traffic. Nothing to change here when that
// happens; it's a setting on the campaign in Lead Prosper, not in this code.

function digitsOnly(value) {
  return (value || '').replace(/\D/g, '')
}

/**
 * Reads every query-string parameter present on the current page URL. e.g.
 * ?lp_subid1=123&sub2=9302383&fbclickid=20394932423 becomes
 * { lp_subid1: '123', sub2: '9302383', fbclickid: '20394932423' }.
 *
 * Ad platforms and affiliate/partner links append tracking params like
 * these to the /quote link they send traffic to, and Lead Prosper wants
 * them forwarded on the post as-is so leads can be attributed back to
 * their source — see submitToLeadProsper below for how these get merged
 * into the payload.
 */
function getUrlParams() {
  if (typeof window === 'undefined') return {}
  return Object.fromEntries(new URLSearchParams(window.location.search).entries())
}

/**
 * Posts a completed /quote wizard submission to Lead Prosper.
 *
 * @param {object} form - flat form state from useQuoteForm
 * @param {object} [extra]
 * @param {string} [extra.trustedFormCertUrl] - value of the TrustedForm-injected
 *   xxTrustedFormCertUrl hidden field, captured at submit time (see useTrustedForm)
 * @param {string} [extra.ipAddress] - the visitor's public IP, from useClientIp
 * @returns {Promise<{id: string, lead_id: string, status: 'ACCEPTED'|'DUPLICATED'|'ERROR', code: number, message: string}>}
 */
export async function submitToLeadProsper(form, extra = {}) {
  const urlParams = getUrlParams()

  const payload = {
    // Default sub-id, overridable by a same-named URL param below (e.g. if
    // the traffic source's own link already carries ?lp_subid1=..., that
    // wins over this default — see the spread order note below).
    lp_subid1: 'quote-wizard',

    // --- lead fields, mapped 1:1 to the spec doc's field table ---
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    phone: digitsOnly(form.phone),
    address: form.address,
    city: form.city,
    state: form.state,
    zip_code: Number(form.zipCode),
    home_owner: form.homeOwner,
    project_type: form.projectType,
    roofing_material: form.roofMaterial,
    time_frame: form.timeFrame,

    // --- tracking + consent evidence ---
    tcpa_text: form.tcpaText,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    landing_page_url: typeof window !== 'undefined' ? window.location.href : undefined,
    ip_address: extra.ipAddress || undefined,
    trustedform_cert_url: extra.trustedFormCertUrl || undefined,

    // Any ?key=value present on the landing page URL (ad-platform click
    // IDs, an lp_subid1/lp_subid2 override, custom sub params, etc.).
    // Spread AFTER the defaults above so a URL param wins over the
    // `lp_subid1: 'quote-wizard'` default, but BEFORE the campaign-identity
    // block below so a query string can never override those.
    ...urlParams,

    // Campaign identity — always exactly these values. Listed last in the
    // object so nothing above (including a crafted URL param) can override
    // them.
    lp_campaign_id: LP_CAMPAIGN_ID,
    lp_supplier_id: LP_SUPPLIER_ID,
    lp_key: LP_KEY,
  }

  const response = await axios.post(LEAD_PROSPER_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 20000,
  })

  return response.data
}
