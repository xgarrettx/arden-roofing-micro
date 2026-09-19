import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TeamMemberEntity } from '../entities/team-member.entity'

@Injectable()
export class TeamMemberRepository {
  constructor(
    @InjectRepository(TeamMemberEntity) private repository: Repository<TeamMemberEntity>,
  ) {}

  findAll() {
    return this.repository.find({ order: { display_order: 'ASC' } })
  }
}
