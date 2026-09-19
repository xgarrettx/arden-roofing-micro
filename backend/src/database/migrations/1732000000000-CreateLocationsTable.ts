import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateLocationsTable1732000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'locations',
        columns: [
          { name: 'id', type: 'bigint', unsigned: true, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'slug', type: 'varchar', length: '160', isNullable: false },
          { name: 'city_name', type: 'varchar', length: '160', isNullable: false },
          { name: 'meta_title', type: 'varchar', length: '255', isNullable: false },
          { name: 'meta_description', type: 'text', isNullable: false },
          { name: 'hero_eyebrow', type: 'varchar', length: '255', isNullable: false },
          { name: 'hero_h1', type: 'varchar', length: '255', isNullable: false },
          { name: 'hero_intro', type: 'text', isNullable: false },
          { name: 'hero_image_alt', type: 'varchar', length: '255', isNullable: false },
          { name: 'intro_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'intro_paragraphs', type: 'json', isNullable: false },
          { name: 'why_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'why_items', type: 'json', isNullable: false },
          { name: 'cta_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'cta_text', type: 'text', isNullable: false },
          { name: 'display_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp(3)', isNullable: false, default: 'CURRENT_TIMESTAMP(3)' },
          { name: 'updated_at', type: 'timestamp(3)', isNullable: false, default: 'CURRENT_TIMESTAMP(3)', onUpdate: 'CURRENT_TIMESTAMP(3)' },
          { name: 'deleted_at', type: 'timestamp(3)', isNullable: true },
        ],
        uniques: [{ name: 'uq_locations_slug', columnNames: ['slug'] }],
        indices: [{ name: 'idx_locations_display_order', columnNames: ['display_order'] }],
      }),
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('locations')
  }
}
