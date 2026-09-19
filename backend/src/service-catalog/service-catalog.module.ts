import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServiceEntity } from './entities/service.entity'
import { ServiceRepository } from './repositories/service.repository'
import { ServiceCatalogService } from './services/service-catalog.service'
import { ServiceCatalogController } from './controllers/service-catalog.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  controllers: [ServiceCatalogController],
  providers: [ServiceCatalogService, ServiceRepository],
  exports: [ServiceCatalogService],
})
export class ServiceCatalogModule {}
