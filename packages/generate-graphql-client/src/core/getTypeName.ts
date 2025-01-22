import type { Type } from './types'

function resolveTypeName(
  type: Type,
  required: boolean,
  wrapEnum: boolean
): string {
  const finalize = (name: string) => {
    return required ? name : `${name} | null`
  }

  if (type.kind === 'NON_NULL') {
    if (type.ofType) {
      return resolveTypeName(type.ofType, true, wrapEnum)
    }
  } else if (type.kind === 'LIST') {
    if (type.ofType) {
      const typeName = resolveTypeName(type.ofType, false, wrapEnum)
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

export function getTypeName(type: Type, wrapEnum: boolean): string {
  return resolveTypeName(type, false, wrapEnum)
}
