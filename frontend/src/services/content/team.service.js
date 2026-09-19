import ApiService from '@/services/api.service'
import { API_ROUTES } from '@/global/consts/api.consts'

export class TeamService {
  static getAll() {
    return ApiService.get(API_ROUTES.TEAM.LIST)
  }
}
