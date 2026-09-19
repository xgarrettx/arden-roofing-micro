import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import { useToast } from 'primevue/usetoast'
import useVuelidate from '@vuelidate/core'
import { required, email as emailValidator, helpers } from '@vuelidate/validators'
import { LeadService } from '@/services/leads/lead.service'
import { ROUTES } from '@/router/constants'

const phoneRegex = /^[0-9+()\-.\s]{7,20}$/

/**
 * Shared form state + validation + submit handling for the Contact and
 * Estimate pages — the two pages only differ in copy and the `source` they
 * pass in, so the logic itself lives here once.
 *
 * @param {'contact'|'estimate'} source
 */
export function useLeadForm(source) {
  const router = useRouter()
  const toast = useToast()

  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  const rules = {
    firstName: { required },
    lastName: {},
    email: { required, email: emailValidator },
    phone: {
      required,
      validPhone: helpers.withMessage('Enter a valid phone number', helpers.regex(phoneRegex)),
    },
    service: {},
    message: {},
  }

  const v$ = useVuelidate(rules, form)

  const {
    loading: submitting,
    runAsync: submitRun,
    error: submitError,
  } = useRequest(LeadService.create, { manual: true })

  async function onSubmit() {
    const isValid = await v$.value.$validate()
    if (!isValid) return

    await submitRun({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      service: form.service,
      message: form.message,
      source,
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })

    if (submitError.value) {
      toast.add({
        severity: 'error',
        summary: 'Something went wrong. Please call us instead.',
        life: 6000,
      })
      return
    }

    router.push({ name: ROUTES.THANK_YOU })
  }

  return { form, v$, submitting, onSubmit }
}
