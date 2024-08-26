import type { Field, InputValue, Type } from '../types/introspection'
import type { Options } from '../types/options'
import { generateComment } from './generateComment'
import { getType } from './getType'
import { resolveDescription } from './resolveDescription'

export function generateObject(
  type: Type,
  fields: (Field | InputValue)[],
  options: Options
) {
  const code: string[] = []
  const comment = generateComment(resolveDescription(type), 0)

  if (comment) {
    code.push(comment)
  }

  code.push(`export interface ${type.name} {`)

  if (type.kind !== 'INPUT_OBJECT' && !options.skipTypename) {
    if (options.markTypenameAsOptional) {
      code.push('  __typename?: string')
    } else {
      code.push('  __typename: string')
    }
  }

  fields.forEach((field) => {
    const isInputObject = type.kind === 'INPUT_OBJECT'

    let required = false

    if (isInputObject) {
      const input = field as InputValue
      if (input.defaultValue != null) {
        required = false
      } else {
        required = input.type.kind === 'NON_NULL'
      }
    } else {
      required = field.type.kind === 'NON_NULL'
    }

    const comment = generateComment(resolveDescription(field), 1)

    if (comment) {
      code.push(comment)
    }

    const mark = required ? '' : '?'
    const wrapEnum = isInputObject && !options.skipWrappingEnum

    code.push(`  ${field.name}${mark}: ${getType(field.type, wrapEnum)}`)
  })

  code.push('}')

  return code.join('\n')
}
