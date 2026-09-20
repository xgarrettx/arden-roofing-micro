import { onMounted, onBeforeUnmount } from 'vue'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
let scriptLoadPromise = null

function loadGoogleMapsScript() {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (!GOOGLE_MAPS_API_KEY) return Promise.resolve(false)
  if (window.google?.maps?.places) return Promise.resolve(true)
  if (scriptLoadPromise) return scriptLoadPromise

  scriptLoadPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

function parseAddressComponents(place) {
  const get = (type) => place.address_components?.find((c) => c.types.includes(type))?.long_name || ''
  const getShort = (type) => place.address_components?.find((c) => c.types.includes(type))?.short_name || ''

  const streetNumber = get('street_number')
  const route = get('route')

  return {
    address: [streetNumber, route].filter(Boolean).join(' '),
    city: get('locality') || get('sublocality') || get('postal_town'),
    state: getShort('administrative_area_level_1'),
    zip: get('postal_code'),
  }
}

/**
 * Attaches Google Places Autocomplete to a street-address text input and
 * calls `onSelect` with { address, city, state, zip } when the user picks a
 * suggestion. Progressive enhancement, not a hard dependency: if
 * VITE_GOOGLE_MAPS_API_KEY isn't set, or the script fails to load, this is
 * a silent no-op and the plain text inputs still work for manual entry.
 *
 * @param {import('vue').Ref<HTMLInputElement|null>} inputRef
 * @param {(parsed: {address: string, city: string, state: string, zip: string}) => void} onSelect
 */
export function useAddressAutocomplete(inputRef, onSelect) {
  let autocomplete = null
  let listener = null

  onMounted(async () => {
    const loaded = await loadGoogleMapsScript()
    if (!loaded || !inputRef.value) return

    autocomplete = new window.google.maps.places.Autocomplete(inputRef.value, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['address_components'],
    })

    listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place?.address_components) return
      onSelect(parseAddressComponents(place))
    })
  })

  onBeforeUnmount(() => {
    if (listener) window.google?.maps?.event?.removeListener(listener)
  })

  return { isAvailable: !!GOOGLE_MAPS_API_KEY }
}
