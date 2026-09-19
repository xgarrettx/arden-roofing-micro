import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateTeamMembersTable1732000000002 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'team_members',
        columns: [
          { name: 'id', type: 'bigint', unsigned: true, isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'name', type: 'varchar', length: '160', isNullable: false },
          { name: 'role', type: 'varchar', length: '160', isNullable: false },
          { name: 'initials', type: 'varchar', length: '4', isNullable: false },
          { name: 'bio', type: 'text', isNullable: false },
          { name: 'display_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp(3)', isNullable: false, default: 'CURRENT_TIMESTAMP(3)' },
          { name: 'updated_at', type: 'timestamp(3)', isNullable: false, default: 'CURRENT_TIMESTAMP(3)', onUpdate: 'CURRENT_TIMESTAMP(3)' },
          { name: 'deleted_at', type: 'timestamp(3)', isNullable: true },
        ],
      }),
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('team_members')
  }
}
