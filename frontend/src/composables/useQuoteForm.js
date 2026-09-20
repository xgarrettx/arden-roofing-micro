import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { useToast } from 'primevue/usetoast'
import { submitToLeadProsper } from '@/services/leads/leadProsper.service'
import { useTrustedForm } from '@/composables/useTrustedForm'
import { useClientIp } from '@/composables/useClientIp'
import { ROUTES } from '@/router/constants'
import { QUOTE_STEP_ORDER, QUOTE_STEPS, ZIP_REGEX, PHONE_REGEX, QUOTE_TCPA_TEXT } from '@/global/consts/quote.consts'

/**
 * State + step navigation + validation + submit handling for the /quote
 * multi-step wizard. Kept separate from `useLeadForm` (Contact/Estimate)
 * because this form has an entirely different shape (7-step wizard vs. a
 * single card) and posts to an external API (Lead Prosper) instead of the
 * Arden backend's own /leads endpoint.
 */
export function useQuoteForm() {
  const router = useRouter()
  const toast = useToast()

  const form = reactive({
    zipCode: '',
    projectType: '',
    roofMaterial: '',
    timeFrame: '',
    homeOwner: '',
    address: '',
    city: '',
    state: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Honeypot: real users never see or fill this (visually hidden in the
    // template). A filled honeypot means a bot — reject silently rather
    // than posting the "lead" to Lead Prosper. Cheap first line of defense
    // per the spec doc's "add validations to ensure this does not get
    // spammed" note; layer on reCAPTCHA/hCaptcha later if spam persists.
    website: '',
    // Sent as-is to Lead Prosper's optional tcpa_text field — see the
    // constant's own comment for why this isn't user-editable.
    tcpaText: QUOTE_TCPA_TEXT,
  })

  const stepIndex = ref(0)
  const currentStep = computed(() => QUOTE_STEP_ORDER[stepIndex.value])
  const totalSteps = QUOTE_STEP_ORDER.length
  const isFirstStep = computed(() => stepIndex.value === 0)
  const isLastStep = computed(() => stepIndex.value === totalSteps - 1)
  const progressPercent = computed(() => Math.round(((stepIndex.value + 1) / totalSteps) * 100))

  const stepError = ref('')

  // --- compliance/tracking data, gathered alongside the form itself ---

  // Template ref for the contact step's <form> element (bound in
  // QuoteWizard.vue). Needed so we can read TrustedForm's injected hidden
  // field off of it at submit time.
  const contactFormRef = ref(null)

  const { injectTrustedFormScript, captureCertUrl } = useTrustedForm()
  const { ipAddress, fetchClientIp } = useClientIp()

  // Kick off the IP lookup as soon as the wizard mounts rather than waiting
  // for the final step — it's a network round-trip to a third party, so
  // give it the whole wizard flow to resolve instead of adding latency to
  // submit.
  fetchClientIp()

  // TrustedForm's script scans the DOM for <form> tags at the moment it
  // executes and injects a hidden xxTrustedFormCertUrl field into whichever
  // ones it finds. The contact form only exists in the DOM on the wizard's
  // last step (it's behind a v-else-if in QuoteWizard.vue), so — unlike a
  // plain HTML page where this snippet sits once near </body> — it has to
  // be injected the first time that step's form actually mounts.
  watch(
    currentStep,
    (step) => {
      if (step === QUOTE_STEPS.CONTACT) {
        injectTrustedFormScript()
      }
    },
    { flush: 'post' }
  )

  function validateStep(step) {
    switch (step) {
      case QUOTE_STEPS.ZIP:
        return ZIP_REGEX.test(form.zipCode.trim()) ? '' : 'Enter a valid 5-digit ZIP code.'
      case QUOTE_STEPS.PROJECT_TYPE:
        return form.projectType ? '' : 'Choose an option to continue.'
      case QUOTE_STEPS.ROOF_MATERIAL:
        return form.roofMaterial ? '' : 'Choose an option to continue.'
      case QUOTE_STEPS.TIME_FRAME:
        return form.timeFrame ? '' : 'Choose an option to continue.'
      case QUOTE_STEPS.HOME_OWNER:
        return form.homeOwner ? '' : 'Choose an option to continue.'
      case QUOTE_STEPS.ADDRESS:
        if (!form.address.trim()) return 'Enter your street address.'
        if (!form.city.trim()) return 'Enter your city.'
        if (!form.state.trim()) return 'Enter your state.'
        return ''
      case QUOTE_STEPS.CONTACT:
        if (!form.firstName.trim()) return 'Enter your first name.'
        if (!form.email.trim() || !form.email.includes('@')) return 'Enter a valid email address.'
        if (!PHONE_REGEX.test(form.phone.trim())) return 'Enter a valid phone number.'
        return ''
      default:
        return ''
    }
  }

  function goNext() {
    const error = validateStep(currentStep.value)
    if (error) {
      stepError.value = error
      return
    }
    stepError.value = ''
    if (!isLastStep.value) stepIndex.value += 1
  }

  function goBack() {
    stepError.value = ''
    if (!isFirstStep.value) stepIndex.value -= 1
  }

  function selectAndAdvance(field, value) {
    form[field] = value
    goNext()
  }

  const {
    loading: submitting,
    runAsync: submitRun,
  } = useRequest(submitToLeadProsper, { manual: true })

  async function onSubmit() {
    const error = validateStep(QUOTE_STEPS.CONTACT)
    if (error) {
      stepError.value = error
      return
    }

    if (form.website) {
      // Honeypot tripped — pretend it worked so the bot doesn't learn
      // anything, but never actually post to Lead Prosper.
      router.push({ name: ROUTES.THANK_YOU })
      return
    }

    try {
      const result = await submitRun(form, {
        trustedFormCertUrl: captureCertUrl(contactFormRef.value),
        ipAddress: ipAddress.value,
      })
      // Lead Prosper returns { status: 'ACCEPTED' | 'DUPLICATED' | 'ERROR', ... }
      // with a 200-range HTTP status even on a rejected lead — the real
      // signal is the `status` field, not the HTTP status code. Treat
      // DUPLICATED as a soft success (they already submitted, not a failure
      // on this attempt) so the user isn't shown an error for something
      // that isn't really one.
      if (result?.status === 'ERROR') {
        toast.add({
          severity: 'error',
          summary: 'Something went wrong submitting your request. Please call us instead.',
          life: 6000,
        })
        return
      }
      router.push({ name: ROUTES.THANK_YOU })
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Something went wrong submitting your request. Please call us instead.',
        life: 6000,
      })
    }
  }

  return {
    form,
    stepIndex,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progressPercent,
    stepError,
    submitting,
    contactFormRef,
    goNext,
    goBack,
    selectAndAdvance,
    onSubmit,
  }
}
