import ApiService from '@/services/api.service'
import { API_ROUTES } from '@/global/consts/api.consts'

export class ServiceCatalogService {
  static getAll() {
    return ApiService.get(API_ROUTES.SERVICES.LIST)
  }

  static getBySlug(slug) {
    return ApiService.get(API_ROUTES.SERVICES.DETAIL(slug))
  }
}
