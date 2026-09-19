import { SITE } from '@/global/consts/site.consts'

const LOCAL_BUSINESS_ID = `${SITE.siteOrigin}/#localbusiness`
const WEBSITE_ID = `${SITE.siteOrigin}/#website`

export function buildLocalBusinessNode(areaServedNames = []) {
  return {
    '@type': 'RoofingContractor',
    '@id': LOCAL_BUSINESS_ID,
    name: SITE.name,
    url: `${SITE.siteOrigin}/`,
    telephone: '+18283054838',
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.addressLocality,
      addressRegion: SITE.addressRegion,
      addressCountry: 'US',
    },
    areaServed: areaServedNames.map((name) => ({ '@type': 'Place', name: `${name}, NC` })),
  }
}

export function buildWebsiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE.siteOrigin}/`,
    name: SITE.name,
    publisher: { '@id': LOCAL_BUSINESS_ID },
  }
}

export function buildServiceNode({ path, name, serviceType }) {
  return {
    '@type': 'Service',
    '@id': `${SITE.siteOrigin}${path}#service`,
    name,
    serviceType,
    url: `${SITE.siteOrigin}${path}`,
    provider: { '@id': LOCAL_BUSINESS_ID },
  }
}

export function buildBreadcrumbList(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE.siteOrigin}${item.path}`,
    })),
  }
}

export function buildOfferCatalog(services) {
  return {
    '@type': 'OfferCatalog',
    name: 'Roofing Services',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': `${SITE.siteOrigin}/services/${service.slug}#service`,
        name: service.label,
        serviceType: service.label,
        url: `${SITE.siteOrigin}/services/${service.slug}`,
        provider: { '@id': LOCAL_BUSINESS_ID },
      },
    })),
  }
}

export function buildGraph(nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
