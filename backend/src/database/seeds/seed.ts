import 'reflect-metadata'
import * as fs from 'fs'
import * as path from 'path'
import { DataSource } from 'typeorm'
import { typeOrmOptions } from '../../app.module'
import { LocationEntity } from '../../locations/entities/location.entity'
import { ServiceEntity } from '../../service-catalog/entities/service.entity'
import { TeamMemberEntity } from '../../team/entities/team-member.entity'

function readJson<T>(filename: string): T {
  const filePath = path.join(__dirname, 'data', filename)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

interface RawLocation {
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
  why_items: { title: string; text: string }[]
  cta_heading: string
  cta_text: string
}

interface RawService {
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
  highlights_items: { title: string; text: string }[]
  cost_heading: string
  cost_rows: { service: string; estimated_cost: string; average: string }[]
  cost_disclaimer: string
  why_heading: string
  why_items: { title: string; text: string }[]
  cta_heading: string
  cta_text: string
  process_heading: string
  process_steps: { title: string; text: string }[]
}

interface RawTeam {
  intro: string
  members: { display_order: number; initials: string; name: string; role: string; bio: string }[]
}

async function seed() {
  const dataSource = new DataSource({
    ...typeOrmOptions,
    entities: [LocationEntity, ServiceEntity, TeamMemberEntity],
  })
  await dataSource.initialize()

  const locationRepo = dataSource.getRepository(LocationEntity)
  const serviceRepo = dataSource.getRepository(ServiceEntity)
  const teamRepo = dataSource.getRepository(TeamMemberEntity)

  const locations = readJson<RawLocation[]>('locations.json')
  const services = readJson<RawService[]>('services.json')
  const team = readJson<RawTeam>('team.json')

  console.log(`Seeding ${locations.length} locations...`)
  for (const [index, loc] of locations.entries()) {
    await locationRepo.upsert(
      {
        slug: loc.slug,
        city_name: loc.city_name,
        meta_title: loc.meta_title,
        meta_description: loc.meta_description,
        hero_eyebrow: loc.hero_eyebrow,
        hero_h1: loc.hero_h1,
        hero_intro: loc.hero_intro,
        hero_image_alt: loc.hero_image_alt,
        intro_heading: loc.intro_heading,
        intro_paragraphs: loc.intro_paragraphs,
        why_heading: loc.why_heading,
        why_items: loc.why_items,
        cta_heading: loc.cta_heading,
        cta_text: loc.cta_text,
        display_order: index,
      },
      ['slug'],
    )
  }

  console.log(`Seeding ${services.length} services...`)
  for (const [index, svc] of services.entries()) {
    await serviceRepo.upsert(
      {
        slug: svc.slug,
        meta_title: svc.meta_title,
        meta_description: svc.meta_description,
        hero_eyebrow: svc.hero_eyebrow,
        hero_h1: svc.hero_h1,
        hero_intro: svc.hero_intro,
        hero_image_alt: svc.hero_image_alt,
        intro_heading: svc.intro_heading,
        intro_paragraphs: svc.intro_paragraphs,
        highlights_heading: svc.highlights_heading,
        highlights_intro: svc.highlights_intro,
        highlights_items: svc.highlights_items,
        cost_heading: svc.cost_heading,
        cost_rows: svc.cost_rows,
        cost_disclaimer: svc.cost_disclaimer,
        why_heading: svc.why_heading,
        why_items: svc.why_items,
        cta_heading: svc.cta_heading,
        cta_text: svc.cta_text,
        process_heading: svc.process_heading,
        process_steps: svc.process_steps,
        display_order: index,
      },
      ['slug'],
    )
  }

  console.log(`Seeding ${team.members.length} team members...`)
  for (const member of team.members) {
    const existing = await teamRepo.findOne({ where: { name: member.name } })
    if (existing) {
      await teamRepo.update(existing.id, member)
    } else {
      await teamRepo.save(teamRepo.create(member))
    }
  }

  await dataSource.destroy()
  console.log('Seed complete.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
