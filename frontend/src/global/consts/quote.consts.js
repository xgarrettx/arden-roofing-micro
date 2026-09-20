// Step config + option lists for the /quote lead-gen wizard, ported directly
// from "Arden Roofing Form Questions and Details.docx". The `lpValue` on
// each option is the exact literal string Lead Prosper expects for that
// field — do not "clean up" casing/spacing on these without checking the
// campaign's field mapping first.

export const QUOTE_STEPS = {
  ZIP: 'zip',
  PROJECT_TYPE: 'projectType',
  ROOF_MATERIAL: 'roofMaterial',
  TIME_FRAME: 'timeFrame',
  HOME_OWNER: 'homeOwner',
  ADDRESS: 'address',
  CONTACT: 'contact',
}

// Order drives both navigation and the progress indicator.
export const QUOTE_STEP_ORDER = [
  QUOTE_STEPS.ZIP,
  QUOTE_STEPS.PROJECT_TYPE,
  QUOTE_STEPS.ROOF_MATERIAL,
  QUOTE_STEPS.TIME_FRAME,
  QUOTE_STEPS.HOME_OWNER,
  QUOTE_STEPS.ADDRESS,
  QUOTE_STEPS.CONTACT,
]

export const PROJECT_TYPE_OPTIONS = [
  { label: 'New Roof', lpValue: 'Install' },
  { label: 'Replace Roof', lpValue: 'Replace' },
  { label: 'Repair Roof', lpValue: 'Repair' },
]

export const ROOF_MATERIAL_OPTIONS = [
  { label: 'Asphalt Shingle', lpValue: 'Asphalt Shingle' },
  { label: 'Tile / Clay', lpValue: 'Tile' },
  { label: 'Natural Slate', lpValue: 'Natural Slate' },
  { label: 'Metal', lpValue: 'Metal' },
  { label: 'Cedar Shake', lpValue: 'Cedar Shake' },
  { label: 'Flat / Tar', lpValue: 'Flat / Tar' },
  { label: 'Other', lpValue: 'Other' },
]

export const TIME_FRAME_OPTIONS = [
  { label: 'ASAP', lpValue: 'ASAP' },
  { label: '1 - 3 Months', lpValue: '1 - 3 Months' },
  { label: '3 - 6 Months', lpValue: '3 - 6 Months' },
  { label: 'Not Sure', lpValue: 'Not Sure' },
]

export const HOME_OWNER_OPTIONS = [
  { label: 'Yes', lpValue: 'Yes' },
  { label: 'No', lpValue: 'No' },
]

export const ZIP_REGEX = /^\d{5}$/
export const PHONE_REGEX = /^[0-9+()\-.\s]{7,20}$/

export const QUOTE_LEGAL_LINKS = {
  referralDisclosure: 'https://ardenroofing.com/legal/referral-marketing-disclosure',
  privacyPolicy: 'https://ardenroofing.com/legal/privacy-policy',
  termsOfUse: 'https://ardenroofing.com/legal/terms-conditions',
}

// Plain-text version of the TCPA consent copy shown on the contact step —
// sent as Lead Prosper's optional `tcpa_text` field so the exact consent
// language the user saw travels with the lead as compliance evidence. Keep
// this in sync with the rendered copy in QuoteWizard.vue (that copy adds
// live links for the 3 references below; this is the flat-text equivalent).
export const QUOTE_TCPA_TEXT =
  'By clicking "Get Estimates," I provide my electronic signature and consent to receive marketing and ' +
  'informational communications from Arden Roofing and Home Improvement Partners identified here ' +
  '(https://ardenroofing.com/legal/referral-marketing-disclosure) at the telephone number and email address I ' +
  'provided, including calls and text messages made using automated technology, an automatic telephone dialing ' +
  'system, prerecorded or artificial voice, including AI-generated or synthetic voice, and messages generated ' +
  'or assisted by artificial intelligence, even if my number is listed on a federal, state, or corporate Do Not ' +
  'Call list. I understand that my consent is not a condition of purchasing any goods or services. Message and ' +
  'data rates may apply, and message frequency may vary. I may opt out of text messages at any time by replying ' +
  'STOP or request help by replying HELP. By clicking "Get Estimates," I also acknowledge that I have read and ' +
  'agree to the Privacy Policy (https://ardenroofing.com/legal/privacy-policy), and Terms of Use ' +
  '(https://ardenroofing.com/legal/terms-conditions), including any applicable arbitration provisions.'
