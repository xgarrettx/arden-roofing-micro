import { ref } from 'vue'

// TrustedForm (ActiveProspect) consent-certification snippet. It scans the
// DOM for <form> elements at the moment its script executes and injects a
// hidden `xxTrustedFormCertUrl` input into each one, then asynchronously
// populates that field with a certificate URL capturing what the visitor
// saw and consented to — this is what gets sent to Lead Prosper as
// `trustedform_cert_url`.
//
// NOTE: this reproduces the standard ActiveProspect TrustedForm loader
// using the exact query params you gave me (field=xxTrustedFormCertUrl,
// use_tagged_consent=true). I rebuilt this from the description in my notes
// rather than a byte-for-byte copy of what you pasted — worth a quick diff
// against the literal snippet in your TrustedForm account dashboard before
// this goes live with real traffic, since consent-tracking scripts are
// exactly the kind of thing you don't want subtly wrong.
const TRUSTEDFORM_FIELD_NAME = 'xxTrustedFormCertUrl'

export function useTrustedForm() {
  const certUrl = ref('')
  let injected = false

  /**
   * Loads the TrustedForm script. Call this once the target <form> element
   * is actually in the DOM — TrustedForm scans for <form> tags at the
   * moment this script executes, and won't pick up a form that gets added
   * later. In this SPA, the contact-step form only exists in the DOM on the
   * wizard's last step (see QuoteWizard.vue), so this is invoked from a
   * watcher on the current step rather than as a static page-load tag.
   */
  function injectTrustedFormScript() {
    if (injected || typeof document === 'undefined') return
    injected = true

    const tf = document.createElement('script')
    tf.type = 'text/javascript'
    tf.async = true
    tf.src =
      (document.location.protocol === 'https:' ? 'https' : 'http') +
      '://api.trustedform.com/trustedform.js?provideReferrer=false&field=' +
      TRUSTEDFORM_FIELD_NAME +
      '&use_tagged_consent=true&l=' +
      (new Date().getTime() + Math.random())

    const firstScript = document.getElementsByTagName('script')[0]
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(tf, firstScript)
    } else {
      document.head.appendChild(tf)
    }
  }

  /**
   * Reads the cert URL TrustedForm wrote into the hidden field on the given
   * form element. Call this at submit time (not before) — the field is
   * populated asynchronously after the script loads, so on a very fast
   * submit it may still be empty. That's fine: trustedform_cert_url is an
   * optional field on Lead Prosper's side.
   */
  function captureCertUrl(formEl) {
    if (!formEl) return ''
    const hidden = formEl.querySelector(`input[name="${TRUSTEDFORM_FIELD_NAME}"]`)
    certUrl.value = hidden?.value || ''
    return certUrl.value
  }

  return { certUrl, injectTrustedFormScript, captureCertUrl }
}
