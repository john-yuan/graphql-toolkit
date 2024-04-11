import type { Type } from '../types/introspection'
import { generateComment } from './generateComment'
import { resolveDescription } from './resolveDescription'

export function generateUnion(type: Type) {
  const code: string[] = []
  const desc = resolveDescription(type)

  if (desc) {
    code.push(generateComment(desc, 0))
  }

  const types = type.possibleTypes?.map((t) => t.name).join(' | ')
  code.push(`export type ${type.name} = ${types}`)

  return code.join('\n')
}
