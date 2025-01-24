import type { Context } from './context'
import type { Type } from './types'

function resolveTypeName(
  ctx: Context,
  type: Type,
  required: boolean,
  wrapEnum: boolean
): string {
  const finalize = (name: string) => {
    return required ? name : `${name} | null`
  }

  const typeName = ctx.getTypeName(type.name)

  if (type.kind === 'NON_NULL') {
    if (type.ofType) {
      return resolveTypeName(ctx, type.ofType, true, wrapEnum)
    }
  } else if (type.kind === 'LIST') {
    if (type.ofType) {
      const typeName = resolveTypeName(ctx, type.ofType, false, wrapEnum)
      return finalize(
        typeName.includes('|') ? `(${typeName})[]` : `${typeName}[]`
      )
    }
  } else if (type.kind === 'ENUM') {
    if (typeName) {
      return finalize(wrapEnum ? `{ $enum: ${typeName} }` : typeName)
    }
  } else if (typeName) {
    if (type.kind === 'SCALAR') {
      if (typeName === 'Boolean') {
        return finalize('boolean')
      }
      if (typeName === 'String') {
        return finalize('string')
      }
    }
    return finalize(typeName)
  }

  return 'any'
}

export function getTypeName(
  ctx: Context,
  type: Type,
  wrapEnum: boolean
): string {
  return resolveTypeName(ctx, type, false, wrapEnum)
}
