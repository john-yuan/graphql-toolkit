import type { Schema } from '../types/introspection'

export function getMutation(schema: Schema) {
  const mutation = schema.mutationType?.name
  return mutation ? schema.types.find((el) => el.name === mutation) : undefined
}
