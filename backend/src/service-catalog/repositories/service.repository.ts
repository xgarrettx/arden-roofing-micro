import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServiceEntity } from '../entities/service.entity'

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(ServiceEntity) private repository: Repository<ServiceEntity>,
  ) {}

  findAll() {
    return this.repository.find({ order: { display_order: 'ASC' } })
  }

  async findBySlug(slug: string) {
    const res = await this.repository.findOne({ where: { slug } })
    if (!res) throw new NotFoundException(`Service "${slug}" not found`)
    return res
  }
}
