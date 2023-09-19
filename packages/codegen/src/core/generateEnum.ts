import type { Type } from '../types/introspection'
import { generateComment } from './generateComment'
import { resolveDescription } from './resolveDescription'

export function generateEnum(type: Type) {
  let desc = resolveDescription(type)

  if (desc) {
    desc += '\n\n'
  }

  type.enumValues?.forEach((item) => {
    desc += `- \`${item.name}\` ${item.description || ''}`.trim() + '\n'
  })

  desc = desc.trim()

  const code: string[] = []

  if (desc) {
    code.push(generateComment(desc, 0))
  }

  code.push(`export type ${type.name} =`)

  type.enumValues?.forEach((item) => {
    code.push(`  | ${JSON.stringify(item.name)}`)
  })

  return code.join('\n')
}
