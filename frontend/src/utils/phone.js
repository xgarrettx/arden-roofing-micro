export function formatPhoneDisplay(digits) {
  const clean = String(digits || '').replace(/\D/g, '')
  if (clean.length !== 10) return digits
  return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`
}

export function phoneHref(digits) {
  const clean = String(digits || '').replace(/\D/g, '')
  return `tel:${clean}`
}
