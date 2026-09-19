import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateServicesTable1732000000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          { name: 'id', type: 'bigint', unsigned: true, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'slug', type: 'varchar', length: '160', isNullable: false },
          { name: 'meta_title', type: 'varchar', length: '255', isNullable: false },
          { name: 'meta_description', type: 'text', isNullable: false },
          { name: 'hero_eyebrow', type: 'varchar', length: '255', isNullable: false },
          { name: 'hero_h1', type: 'varchar', length: '255', isNullable: false },
          { name: 'hero_intro', type: 'text', isNullable: false },
          { name: 'hero_image_alt', type: 'varchar', length: '255', isNullable: false },
          { name: 'intro_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'intro_paragraphs', type: 'json', isNullable: false },
          { name: 'highlights_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'highlights_intro', type: 'text', isNullable: false },
          { name: 'highlights_items', type: 'json', isNullable: false },
          { name: 'cost_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'cost_rows', type: 'json', isNullable: false },
          { name: 'cost_disclaimer', type: 'text', isNullable: false },
          { name: 'why_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'why_items', type: 'json', isNullable: false },
          { name: 'cta_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'cta_text', type: 'text', isNullable: false },
          { name: 'process_heading', type: 'varchar', length: '255', isNullable: false },
          { name: 'process_steps', type: 'json', isNullable: false },
          { name: 'display_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp(3)', isNullable: false, default: 'CURRENT_TIMESTAMP(3)' },
          { name: 'updated_at', type: 'timestamp(3)', isNullable: false, default: 'CURRENT_TIMESTAMP(3)', onUpdate: 'CURRENT_TIMESTAMP(3)' },
          { name: 'deleted_at', type: 'timestamp(3)', isNullable: true },
        ],
        uniques: [{ name: 'uq_services_slug', columnNames: ['slug'] }],
      }),
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('services')
  }
}
