import { DateTime } from 'luxon'
import { ValueTransformer } from 'typeorm'

/**
 * Converts DB bigint strings <-> JS numbers, per the backend guidelines'
 * rule that bigint id/foreign-key columns use a number transformer.
 */
export const number: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value === null || value === undefined ? value : Number(value)),
}

/**
 * Stores timestamps as MySQL TIMESTAMP(3) for readability, while the app
 * works with epoch milliseconds (numbers) everywhere in code.
 */
export const timestamp: ValueTransformer = {
  to: (value?: number | null) => (value === null || value === undefined ? value : DateTime.fromMillis(value).toUTC().toSQL({ includeOffset: false })),
  from: (value?: Date | null) => (value === null || value === undefined ? value : DateTime.fromJSDate(value).toMillis()),
}
