import type { Type } from './types'

export function getRealType(type: Type): Type {
  return type.ofType ? getRealType(type.ofType) : type
}
