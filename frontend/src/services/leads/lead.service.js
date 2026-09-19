import ApiService from '@/services/api.service'
import { API_ROUTES } from '@/global/consts/api.consts'

export class LeadService {
  static create({ firstName, lastName, email, phone, service, message, source, sourcePage }) {
    return ApiService.post(API_ROUTES.LEADS.CREATE, {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      service,
      message,
      source,
      source_page: sourcePage,
    })
  }
}
