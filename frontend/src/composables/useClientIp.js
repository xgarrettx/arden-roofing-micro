import { ref } from 'vue'
import axios from 'axios'

// Lead Prosper's optional `ip_address` field isn't obtainable from
// navigator/window — browsers don't expose the client's public IP to page
// JS — so this asks a small external lookup service instead. ipify is
// free, needs no API key, and responds with CORS enabled, which is why it's
// used here rather than a server-side hop through the Arden backend.
const IP_LOOKUP_URL = 'https://api.ipify.org?format=json'

export function useClientIp() {
  const ipAddress = ref('')

  /**
   * Fire-and-forget: call this as early as possible (wizard mount, not
   * submit time) so the lookup has the whole multi-step flow to resolve
   * before it's actually needed.
   */
  async function fetchClientIp() {
    if (typeof window === 'undefined') return
    try {
      const { data } = await axios.get(IP_LOOKUP_URL, { timeout: 5000 })
      ipAddress.value = data?.ip || ''
    } catch {
      // Non-fatal — ip_address is optional for Lead Prosper. Submission
      // proceeds without it rather than blocking the user on a third-party
      // lookup failing or timing out.
      ipAddress.value = ''
    }
  }

  return { ipAddress, fetchClientIp }
}
