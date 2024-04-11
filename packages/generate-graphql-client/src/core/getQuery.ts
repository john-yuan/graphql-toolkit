import type { Schema } from '../types/introspection'

export function getQuery(schema: Schema) {
  const query = schema.queryType.name
  return query ? schema.types.find((el) => el.name === query) : undefined
}
