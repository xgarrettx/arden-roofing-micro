import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { number, timestamp } from '../../global/db/transformers'

export enum LeadSource {
  CONTACT = 'contact',
  ESTIMATE = 'estimate',
}

@Entity('leads')
export class LeadEntity {
  @PrimaryColumn('bigint', { transformer: [number], generated: true })
  id: number

  @Column()
  first_name: string

  @Column({ nullable: true })
  last_name?: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column({ nullable: true })
  service?: string

  @Column('text', { nullable: true })
  message?: string

  @Column({ type: 'enum', enum: LeadSource })
  source: LeadSource

  @Column({ nullable: true })
  source_page?: string

  @CreateDateColumn({ type: 'timestamp', transformer: [timestamp] })
  created_at: number
}
