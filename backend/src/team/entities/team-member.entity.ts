import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { number, timestamp } from '../../global/db/transformers'

@Entity('team_members')
export class TeamMemberEntity {
  @PrimaryColumn('bigint', { transformer: [number], generated: true })
  id: number

  @Column()
  name: string

  @Column()
  role: string

  @Column({ length: 4 })
  initials: string

  @Column('text')
  bio: string

  @Column('int', { default: 0 })
  display_order: number

  @CreateDateColumn({ type: 'timestamp', transformer: [timestamp] })
  created_at: number

  @UpdateDateColumn({ type: 'timestamp', transformer: [timestamp] })
  updated_at: number

  @DeleteDateColumn({ type: 'timestamp', transformer: [timestamp], nullable: true })
  deleted_at?: number
}
