import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocationEntity } from './entities/location.entity'
import { LocationRepository } from './repositories/location.repository'
import { LocationService } from './services/location.service'
import { LocationController } from './controllers/location.controller'

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService],
})
export class LocationsModule {}
