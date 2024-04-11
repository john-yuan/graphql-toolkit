import type { Type } from '../types/introspection'

export function getType(type: Type, wrapEnum?: boolean): string {
  if (type.kind === 'NON_NULL') {
    if (type.ofType) {
      return getType(type.ofType, wrapEnum)
    }
  } else if (type.kind === 'LIST') {
    if (type.ofType) {
      return `${getType(type.ofType, wrapEnum)}[]`
    }
  } else if (type.kind === 'ENUM') {
    if (type.name) {
      return wrapEnum ? `{ $enum: ${type.name} }` : type.name
    }
  } else if (type.name) {
    if (type.kind === 'SCALAR') {
      if (type.name === 'Boolean') {
        return 'boolean'
      }
      if (type.name === 'String') {
        return 'string'
      }
    }

    return type.name
  }

  return 'any'
}
