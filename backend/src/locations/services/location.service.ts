import { Injectable } from '@nestjs/common'
import { LocationRepository } from '../repositories/location.repository'
import { LocationResponseDto, LocationSummaryDto } from '../dto/location-response.dto'

@Injectable()
export class LocationService {
  constructor(private locationRepository: LocationRepository) {}

  async findAll() {
    const locations = await this.locationRepository.findAll()
    return LocationSummaryDto.buildAll(locations)
  }

  async findBySlug(slug: string) {
    const location = await this.locationRepository.findBySlug(slug)
    return LocationResponseDto.build(location)
  }
}
