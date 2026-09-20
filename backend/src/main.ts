// Must be the very first thing that runs: env.configs.ts builds its
// Config object from process.env at MODULE IMPORT TIME (a plain object,
// not lazy) — Nest's ConfigModule.forRoot() in app.module.ts also loads
// .env, but only once Nest's DI system processes it, which is well after
// Config has already been constructed from a still-empty process.env.
// Loading dotenv here, before any other import, guarantees .env is in
// process.env before env.configs.ts (or anything else) reads it.
import 'dotenv/config'
import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { Config } from './env.configs'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.enableCors({
    origin: Config.corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
  })

  await app.listen(Config.port)
  // eslint-disable-next-line no-console
  console.log(`Arden Roofing API listening on port ${Config.port} (${Config.stage})`)
}

bootstrap()
