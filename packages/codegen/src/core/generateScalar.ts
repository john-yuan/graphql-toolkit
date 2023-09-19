import type { Type } from '../types/introspection'
import { generateComment } from './generateComment'
import { resolveDescription } from './resolveDescription'

const defaultScalarMapping: Record<string, string> = {
  Int: 'number',
  Float: 'number',
  String: 'string',
  Boolean: 'boolean',
  ID: 'string'
}

export function generateScalar(
  type: Type,
  scalarTypes: Record<string, string>
) {
  const code: string[] = []
  const name = type.name || ''
  const comment = `Scalar type: \`${name}\`.`

  let desc = resolveDescription(type)

  if (desc) {
    desc = comment + '\n\n' + desc
  } else {
    desc = comment
  }

  desc = desc.trim()

  code.push(generateComment(desc, 0))

  let typeName = scalarTypes[name] || defaultScalarMapping[name]

  if (!typeName) {
    typeName = 'unknown'
  }

  const mapped = typeName !== 'unknown'

  code.push(`export type ${type.name} = ${typeName}`)

  return { code: code.join('\n'), name, mapped }
}
