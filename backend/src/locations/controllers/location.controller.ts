import { Controller, Get, Param } from '@nestjs/common'
import { LocationService } from '../services/location.service'

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll() {
    return this.locationService.findAll()
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.locationService.findBySlug(slug)
  }
}
