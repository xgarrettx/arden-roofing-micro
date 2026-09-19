import { SetMetadata } from '@nestjs/common'

// Reserved for future auth work: mark a route as not requiring auth once an
// AuthGuard exists. This microsite currently has no authenticated area, so
// nothing consumes this yet — kept here so new admin routes can opt in to
// the guideline's guard pattern without inventing it from scratch later.
export const Public = () => SetMetadata('skipAuth', true)
