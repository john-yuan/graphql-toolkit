import type { Schema } from '../types/introspection'

export function getSubscription(schema: Schema) {
  const subscription = schema.subscriptionType?.name
  return subscription
    ? schema.types.find((el) => el.name === subscription)
    : undefined
}
