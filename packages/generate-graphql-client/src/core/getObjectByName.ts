import type { Schema } from '../types/introspection'

export function getObjectByName(schema: Schema, name?: string | null) {
  return name ? schema.types.find((el) => name === el.name) : undefined
}
