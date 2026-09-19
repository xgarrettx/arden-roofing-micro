import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateLeadsTable1732000000003 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'leads',
        columns: [
          { name: 'id', type: 'bigint', unsigned: true, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'first_name', type: 'varchar', length: '255', isNullable: false },
          { name: 'last_name', type: 'varchar', length: '255', isNullable: true },
          { name: 'email', type: 'varchar', length: '255', isNullable: false },
          { name: 'phone', type: 'varchar', length: '40', isNullable: false },
          { name: 'service', type: 'varchar', length: '120', isNullable: true },
          { name: 'message', type: 'text', isNullable: true },
          { name: 'source', type: 'enum', enum: ['contact', 'estimate'], isNullable: false },
          { name: 'source_page', type: 'varchar', length: '255', isNullable: true },
          { name: 'created_at', type: 'timestamp(3)', isNullable: false, default: 'CURRENT_TIMESTAMP(3)' },
        ],
        indices: [{ name: 'idx_leads_created_at', columnNames: ['created_at'] }],
      }),
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('leads')
  }
}
