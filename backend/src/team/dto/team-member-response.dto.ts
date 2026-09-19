import { TeamMemberEntity } from '../entities/team-member.entity'

export class TeamMemberResponseDto {
  name: string
  role: string
  initials: string
  bio: string

  static build(entity: TeamMemberEntity): TeamMemberResponseDto {
    return { name: entity.name, role: entity.role, initials: entity.initials, bio: entity.bio }
  }

  static buildAll(entities: TeamMemberEntity[]): TeamMemberResponseDto[] {
    return entities.map((e) => this.build(e))
  }
}
