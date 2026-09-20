import { ROUTES } from './constants'

export const routes = [
  {
    path: '/',
    name: ROUTES.HOME,
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/about',
    name: ROUTES.ABOUT,
    component: () => import('@/pages/AboutPage.vue'),
  },
  {
    path: '/services',
    name: ROUTES.SERVICES_INDEX,
    component: () => import('@/pages/ServicesIndexPage.vue'),
  },
  {
    path: '/services/:serviceSlug',
    name: ROUTES.SERVICE_DETAIL,
    component: () => import('@/pages/ServiceDetailPage.vue'),
  },
  {
    path: '/service-areas',
    name: ROUTES.SERVICE_AREAS_INDEX,
    component: () => import('@/pages/ServiceAreasPage.vue'),
  },
  {
    path: '/service-areas/:citySlug',
    name: ROUTES.LOCATION_DETAIL,
    component: () => import('@/pages/LocationPage.vue'),
  },
  {
    path: '/contact',
    name: ROUTES.CONTACT,
    component: () => import('@/pages/ContactPage.vue'),
  },
  {
    path: '/estimate',
    name: ROUTES.ESTIMATE,
    component: () => import('@/pages/EstimatePage.vue'),
  },
  {
    path: '/quote',
    name: ROUTES.QUOTE,
    component: () => import('@/pages/QuotePage.vue'),
  },
  {
    path: '/thank-you',
    name: ROUTES.THANK_YOU,
    component: () => import('@/pages/ThankYouPage.vue'),
  },
  {
    path: '/faq',
    name: ROUTES.FAQ,
    component: () => import('@/pages/FaqPage.vue'),
  },
  {
    path: '/team',
    name: ROUTES.TEAM,
    component: () => import('@/pages/TeamPage.vue'),
  },
  {
    path: '/careers',
    name: ROUTES.CAREERS,
    component: () => import('@/pages/CareersPage.vue'),
  },
  {
    path: '/legal/:legalSlug',
    name: ROUTES.LEGAL,
    component: () => import('@/pages/legal/LegalPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTES.NOT_FOUND,
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]
