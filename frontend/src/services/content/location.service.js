import ApiService from '@/services/api.service'
import { API_ROUTES } from '@/global/consts/api.consts'

export class LocationService {
  static getAll() {
    return ApiService.get(API_ROUTES.LOCATIONS.LIST)
  }

  static getBySlug(slug) {
    return ApiService.get(API_ROUTES.LOCATIONS.DETAIL(slug))
  }
}
