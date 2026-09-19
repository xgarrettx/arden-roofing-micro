// Short marketing labels/teasers for the 3 services, used on the services
// index page and in nav/footer links. The full page body for each service
// (hero, highlights, cost table, process, etc.) comes from the CMS-backed
// /services API — these are just the one-line index-card blurbs, which
// don't warrant their own DB column.
export const SERVICE_SUMMARIES = [
  {
    slug: 'repair',
    label: 'Roofing Repair',
    teaser: 'Targeted roof repairs for leaks, damaged shingles, flashing problems, and other localized roofing issues.',
  },
  {
    slug: 'install',
    label: 'Roofing Install',
    teaser: 'New roofing installation for additions, new construction, and projects that need a complete roofing system.',
  },
  {
    slug: 'replacement',
    label: 'Roofing Replacement',
    teaser: 'Complete roof replacement for aging, worn, repeatedly leaking, or extensively damaged residential roofing systems.',
  },
]
