import { LocationCard, LocationEntity } from '../entities/location.entity'

export class LocationSummaryDto {
  slug: string
  city_name: string

  static build(entity: LocationEntity): LocationSummaryDto {
    return { slug: entity.slug, city_name: entity.city_name }
  }

  static buildAll(entities: LocationEntity[]): LocationSummaryDto[] {
    return entities.map((e) => this.build(e))
  }
}

export class LocationResponseDto {
  slug: string
  city_name: string
  meta_title: string
  meta_description: string
  hero_eyebrow: string
  hero_h1: string
  hero_intro: string
  hero_image_alt: string
  intro_heading: string
  intro_paragraphs: string[]
  why_heading: string
  why_items: LocationCard[]
  cta_heading: string
  cta_text: string

  static build(entity: LocationEntity): LocationResponseDto {
    return {
      slug: entity.slug,
      city_name: entity.city_name,
      meta_title: entity.meta_title,
      meta_description: entity.meta_description,
      hero_eyebrow: entity.hero_eyebrow,
      hero_h1: entity.hero_h1,
      hero_intro: entity.hero_intro,
      hero_image_alt: entity.hero_image_alt,
      intro_heading: entity.intro_heading,
      intro_paragraphs: entity.intro_paragraphs,
      why_heading: entity.why_heading,
      why_items: entity.why_items,
      cta_heading: entity.cta_heading,
      cta_text: entity.cta_text,
    }
  }
}
