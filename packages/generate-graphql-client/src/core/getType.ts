import type { Type } from '../types/introspection'

function getTypeName(type: Type, required: boolean, wrapEnum: boolean): string {
  const finalize = (name: string) => {
    return required ? name : `${name} | null`
  }

  if (type.kind === 'NON_NULL') {
    if (type.ofType) {
      return getTypeName(type.ofType, true, wrapEnum)
    }
  } else if (type.kind === 'LIST') {
    if (type.ofType) {
      const typeName = getTypeName(type.ofType, false, wrapEnum)
      return finalize(
        typeName.includes('|') ? `(${typeName})[]` : `${typeName}[]`
      )
    }
  } else if (type.kind === 'ENUM') {
    if (type.name) {
      return finalize(wrapEnum ? `{ $enum: ${type.name} }` : type.name)
    }
  } else if (type.name) {
    if (type.kind === 'SCALAR') {
      if (type.name === 'Boolean') {
        return finalize('boolean')
      }
      if (type.name === 'String') {
        return finalize('string')
      }
    }
    return finalize(type.name)
  }

  return 'any'
}

export function getType(type: Type, wrapEnum: boolean): string {
  return getTypeName(type, false, wrapEnum)
}
