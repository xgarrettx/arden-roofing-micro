import { Injectable } from '@nestjs/common'
import { ServiceRepository } from '../repositories/service.repository'
import { ServiceResponseDto, ServiceSummaryDto } from '../dto/service-response.dto'

@Injectable()
export class ServiceCatalogService {
  constructor(private serviceRepository: ServiceRepository) {}

  async findAll() {
    const services = await this.serviceRepository.findAll()
    return ServiceSummaryDto.buildAll(services)
  }

  async findBySlug(slug: string) {
    const service = await this.serviceRepository.findBySlug(slug)
    return ServiceResponseDto.build(service)
  }
}
