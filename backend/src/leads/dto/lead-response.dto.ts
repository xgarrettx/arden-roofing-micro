import { LeadEntity } from '../entities/lead.entity'

export class LeadResponseDto {
  id: number
  first_name: string
  email: string
  created_at: number

  static build(entity: LeadEntity): LeadResponseDto {
    return {
      id: entity.id,
      first_name: entity.first_name,
      email: entity.email,
      created_at: entity.created_at,
    }
  }
}
