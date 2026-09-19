import { ServiceCard, ServiceCostRow, ServiceEntity } from '../entities/service.entity'

export class ServiceSummaryDto {
  slug: string
  hero_h1: string
  hero_eyebrow: string
  meta_description: string

  static build(entity: ServiceEntity): ServiceSummaryDto {
    return {
      slug: entity.slug,
      hero_h1: entity.hero_h1,
      hero_eyebrow: entity.hero_eyebrow,
      meta_description: entity.meta_description,
    }
  }

  static buildAll(entities: ServiceEntity[]): ServiceSummaryDto[] {
    return entities.map((e) => this.build(e))
  }
}

export class ServiceResponseDto {
  slug: string
  meta_title: string
  meta_description: string
  hero_eyebrow: string
  hero_h1: string
  hero_intro: string
  hero_image_alt: string
  intro_heading: string
  intro_paragraphs: string[]
  highlights_heading: string
  highlights_intro: string
  highlights_items: ServiceCard[]
  cost_heading: string
  cost_rows: ServiceCostRow[]
  cost_disclaimer: string
  why_heading: string
  why_items: ServiceCard[]
  cta_heading: string
  cta_text: string
  process_heading: string
  process_steps: ServiceCard[]

  static build(entity: ServiceEntity): ServiceResponseDto {
    return {
      slug: entity.slug,
      meta_title: entity.meta_title,
      meta_description: entity.meta_description,
      hero_eyebrow: entity.hero_eyebrow,
      hero_h1: entity.hero_h1,
      hero_intro: entity.hero_intro,
      hero_image_alt: entity.hero_image_alt,
      intro_heading: entity.intro_heading,
      intro_paragraphs: entity.intro_paragraphs,
      highlights_heading: entity.highlights_heading,
      highlights_intro: entity.highlights_intro,
      highlights_items: entity.highlights_items,
      cost_heading: entity.cost_heading,
      cost_rows: entity.cost_rows,
      cost_disclaimer: entity.cost_disclaimer,
      why_heading: entity.why_heading,
      why_items: entity.why_items,
      cta_heading: entity.cta_heading,
      cta_text: entity.cta_text,
      process_heading: entity.process_heading,
      process_steps: entity.process_steps,
    }
  }
}
