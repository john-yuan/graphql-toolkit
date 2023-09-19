import type { Type } from '../types/introspection'

export function getLastType(type: Type): Type {
  return type.ofType ? getLastType(type.ofType) : type
}
