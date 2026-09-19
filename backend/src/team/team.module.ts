import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeamMemberEntity } from './entities/team-member.entity'
import { TeamMemberRepository } from './repositories/team-member.repository'
import { TeamService } from './services/team.service'
import { TeamController } from './controllers/team.controller'

@Module({
  imports: [TypeOrmModule.forFeature([TeamMemberEntity])],
  controllers: [TeamController],
  providers: [TeamService, TeamMemberRepository],
  exports: [TeamService],
})
export class TeamModule {}
