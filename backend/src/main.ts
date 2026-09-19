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
