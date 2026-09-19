import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { LeadService } from '../services/lead.service'
import { CreateLeadDto } from '../dto/create-lead.dto'

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadService.create(createLeadDto)
  }
}
