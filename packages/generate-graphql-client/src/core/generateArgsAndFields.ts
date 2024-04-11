import type { Context } from '../types/context'
import type { InputValue, Type } from '../types/introspection'
import { cap } from './cap'
import { generateComment } from './generateComment'
import { getLastType } from './getLastType'
import { getMutation } from './getMutation'
import { getObjectByName } from './getObjectByName'
import { getQuery } from './getQuery'
import { getSafeTypeName } from './getSafeTypeName'
import { getSubscription } from './getSubscription'
import { getType } from './getType'
import { resolveDescription } from './resolveDescription'

export function generateArgsAndFields(ctx: Context) {
  const query = getQuery(ctx.schema)
  const mutation = getMutation(ctx.schema)
  const subscription = getSubscription(ctx.schema)
  const processed: Record<string, string> = {}

  if (query) {
    createFields(ctx, processed, query, query.name)
  }

  if (mutation) {
    createFields(ctx, processed, mutation, mutation.name)
  }

  if (subscription) {
    createFields(ctx, processed, subscription, subscription.name)
  }
}

function createFields(
  ctx: Context,
  processed: Record<string, string>,
  type: Type,
  operationType?: string
) {
  const objectTypeName = type.name || ''

  if (processed[objectTypeName]) {
    return processed[objectTypeName]
  }

  const typeName = getSafeTypeName(ctx, `${cap(objectTypeName)}Fields`)
  const code: string[] = []

  processed[objectTypeName] = typeName

  if (operationType) {
    code.push(`export interface ${typeName} {`)
  } else {
    code.push(
      `export interface ${typeName}<Args = void> extends $Fields<Args> {`
    )
  }

  type.fields?.forEach((field) => {
    const comment = generateComment(resolveDescription(field), 1)

    if (comment) {
      code.push(comment)
    }

    const last = getLastType(field.type)

    let fieldType = '$Primitive'

    if (last.kind === 'OBJECT' || last.kind === 'INTERFACE') {
      const subType = getObjectByName(ctx.schema, last.name)

      if (subType) {
        fieldType = createFields(ctx, processed, subType)
      } else {
        fieldType = '$Fields'
      }
    } else if (last.kind === 'UNION') {
      fieldType = '$Fields'
    }

    if (field.args.length) {
      const argsTypeName = getSafeTypeName(
        ctx,
        `${cap(objectTypeName)}${cap(field.name)}Args`
      )

      fieldType = `${fieldType}<${argsTypeName}>`

      createArgs(ctx, argsTypeName, field.args)
    }

    const operationArgsType = fieldType

    if (!fieldType.startsWith('$Primitive')) {
      fieldType = `$Object<${fieldType}>`
    }

    code.push(`  ${field.name}?: ${fieldType}`)

    if (operationType) {
      ctx.operationFields[operationType] =
        ctx.operationFields[operationType] || []

      ctx.operationFields[operationType].push({
        name: field.name,
        argsType: operationArgsType,
        returnType: getType(field.type),
        description: resolveDescription(field)
      })
    }
  })

  code.push('}')

  ctx.fields.push(typeName)
  ctx.code[typeName] = code.join('\n')

  if (operationType) {
    const opName = getSafeTypeName(ctx, `${operationType}Operation`)

    ctx.operations[operationType] = opName
    ctx.code[opName] = `export type ${opName} = $Operation<${typeName}>`
  }

  return typeName
}

function createArgs(ctx: Context, typeName: string, args: InputValue[]) {
  const code: string[] = []

  code.push(`export interface ${typeName} {`)

  args.forEach((arg) => {
    const desc = resolveDescription(arg)

    if (desc) {
      code.push(generateComment(desc, 1))
    }

    const argType = getType(arg.type, true)
    const required = arg.defaultValue == null && arg.type.kind === 'NON_NULL'

    if (required) {
      code.push(`  ${arg.name}: ${argType}`)
    } else {
      code.push(`  ${arg.name}?: ${argType} | null`)
    }
  })

  code.push('}')

  ctx.args.push(typeName)
  ctx.code[typeName] = code.join('\n')
}
