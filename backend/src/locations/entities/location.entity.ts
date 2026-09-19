import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { number, timestamp } from '../../global/db/transformers'

export interface LocationCard {
  title: string
  text: string
}

@Entity('locations')
export class LocationEntity {
  @PrimaryColumn('bigint', { transformer: [number], generated: true })
  id: number

  @Column({ unique: true })
  slug: string

  @Column()
  city_name: string

  @Column()
  meta_title: string

  @Column('text')
  meta_description: string

  @Column()
  hero_eyebrow: string

  @Column()
  hero_h1: string

  @Column('text')
  hero_intro: string

  @Column()
  hero_image_alt: string

  @Column()
  intro_heading: string

  @Column('json')
  intro_paragraphs: string[]

  @Column()
  why_heading: string

  @Column('json')
  why_items: LocationCard[]

  @Column()
  cta_heading: string

  @Column('text')
  cta_text: string

  @Column('int', { default: 0 })
  display_order: number

  @CreateDateColumn({ type: 'timestamp', transformer: [timestamp] })
  created_at: number

  @UpdateDateColumn({ type: 'timestamp', transformer: [timestamp] })
  updated_at: number

  @DeleteDateColumn({ type: 'timestamp', transformer: [timestamp], nullable: true })
  deleted_at?: number
}
