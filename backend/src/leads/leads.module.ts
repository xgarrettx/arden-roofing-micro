import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LeadEntity } from './entities/lead.entity'
import { LeadRepository } from './repositories/lead.repository'
import { LeadService } from './services/lead.service'
import { LeadController } from './controllers/lead.controller'

@Module({
  imports: [TypeOrmModule.forFeature([LeadEntity])],
  controllers: [LeadController],
  providers: [LeadService, LeadRepository],
  exports: [LeadService],
})
export class LeadsModule {}
