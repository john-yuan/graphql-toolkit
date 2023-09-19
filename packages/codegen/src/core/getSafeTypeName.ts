import type { Context } from '../types/context'

export function getSafeTypeName(ctx: Context, typeName: string) {
  const getTypeName = () => {
    let index = 1
    let tryName = typeName

    while (ctx.identifiers[tryName]) {
      tryName = `${typeName}${index}`
      index += 1
    }

    return tryName
  }

  const safeTypeName = getTypeName()

  ctx.identifiers[safeTypeName] = 'generated'

  return safeTypeName
}
