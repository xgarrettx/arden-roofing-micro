import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSourceOptions } from 'typeorm'
import { ENV_SCHEMA, Config } from './env.configs'
import { GlobalExceptionFilter } from './global/exceptions/global-exception.filter'
import { LocationsModule } from './locations/locations.module'
import { ServiceCatalogModule } from './service-catalog/service-catalog.module'
import { TeamModule } from './team/team.module'
import { LeadsModule } from './leads/leads.module'
import { LocationEntity } from './locations/entities/location.entity'
import { ServiceEntity } from './service-catalog/entities/service.entity'
import { TeamMemberEntity } from './team/entities/team-member.entity'
import { LeadEntity } from './leads/entities/lead.entity'

export const typeOrmOptions: DataSourceOptions = {
  type: 'mysql',
  host: Config.db.host,
  port: Config.db.port,
  username: Config.db.username,
  password: Config.db.password,
  database: Config.db.database,
  entities: [LocationEntity, ServiceEntity, TeamMemberEntity, LeadEntity],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  synchronize: false, // Never use synchronize — schema changes go through migrations.
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: ENV_SCHEMA }),
    TypeOrmModule.forRoot(typeOrmOptions),
    LocationsModule,
    ServiceCatalogModule,
    TeamModule,
    LeadsModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
