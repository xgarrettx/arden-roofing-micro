import { Injectable, Logger } from '@nestjs/common'
import { LeadRepository } from '../repositories/lead.repository'
import { CreateLeadDto } from '../dto/create-lead.dto'
import { LeadResponseDto } from '../dto/lead-response.dto'
import { Config } from '../../env.configs'

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name)

  constructor(private leadRepository: LeadRepository) {}

  async create(dto: CreateLeadDto) {
    const lead = await this.leadRepository.create(dto)

    // Notification hook: wire an email/SMS provider here (e.g. Nodemailer,
    // Postmark, Twilio) and send to Config.leadNotificationEmail. Left as a
    // log line for now — no transactional-email provider is configured yet.
    this.logger.log(
      `New ${lead.source} lead: ${lead.first_name} <${lead.email}> — notify ${Config.leadNotificationEmail || '(no address configured)'}`,
    )

    return LeadResponseDto.build(lead)
  }
}
