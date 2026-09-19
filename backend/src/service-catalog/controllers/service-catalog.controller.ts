import { Controller, Get, Param } from '@nestjs/common'
import { ServiceCatalogService } from '../services/service-catalog.service'

@Controller('services')
export class ServiceCatalogController {
  constructor(private readonly serviceCatalogService: ServiceCatalogService) {}

  @Get()
  findAll() {
    return this.serviceCatalogService.findAll()
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.serviceCatalogService.findBySlug(slug)
  }
}
