import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LocationEntity } from '../entities/location.entity'

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(LocationEntity) private repository: Repository<LocationEntity>,
  ) {}

  findAll() {
    return this.repository.find({ order: { display_order: 'ASC' } })
  }

  async findBySlug(slug: string) {
    const res = await this.repository.findOne({ where: { slug } })
    if (!res) throw new NotFoundException(`Location "${slug}" not found`)
    return res
  }
}
