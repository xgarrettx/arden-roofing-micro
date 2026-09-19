import 'reflect-metadata'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import { typeOrmOptions } from './src/app.module'

config()

// Used by the TypeORM CLI (migration:generate / migration:run / migration:revert).
// Points at the same connection options the app uses, built from process.env
// directly since this file runs outside Nest's ConfigModule bootstrap.
export default new DataSource({
  ...typeOrmOptions,
  entities: [__dirname + '/src/**/entities/*.entity{.ts,.js}'],
})
