import { Injectable } from '@nestjs/common'
import { TeamMemberRepository } from '../repositories/team-member.repository'
import { TeamMemberResponseDto } from '../dto/team-member-response.dto'

@Injectable()
export class TeamService {
  constructor(private teamMemberRepository: TeamMemberRepository) {}

  async findAll() {
    const members = await this.teamMemberRepository.findAll()
    return TeamMemberResponseDto.buildAll(members)
  }
}
