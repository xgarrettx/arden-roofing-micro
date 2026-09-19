import * as Joi from 'joi'

export const ENV_SCHEMA = Joi.object({
  STAGE: Joi.string().valid('development', 'staging', 'production').default('development'),
  PORT: Joi.number().default(3001),
  CORS_ORIGIN: Joi.string().default('http://127.0.0.1:3000'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().optional().allow(''),
  DB_DATABASE: Joi.string().required(),

  LEAD_NOTIFICATION_EMAIL: Joi.string().email().optional().allow(''),
})

// Static accessor for values needed at import time (e.g. TypeORM CLI config).
export const Config = {
  stage: process.env.STAGE || 'development',
  port: Number(process.env.PORT) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://127.0.0.1:3000',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'arden_roofing',
  },
  leadNotificationEmail: process.env.LEAD_NOTIFICATION_EMAIL || '',
}
