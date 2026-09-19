import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LeadEntity } from '../entities/lead.entity'
import { CreateLeadDto } from '../dto/create-lead.dto'

@Injectable()
export class LeadRepository {
  constructor(
    @InjectRepository(LeadEntity) private repository: Repository<LeadEntity>,
  ) {}

  create(dto: CreateLeadDto) {
    const lead = this.repository.create(dto)
    return this.repository.save(lead)
  }
}
