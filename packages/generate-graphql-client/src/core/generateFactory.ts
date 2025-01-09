import type { Context } from '../types/context'
import { factoryTemplate } from './factoryTemplate'
import { generateComment } from './generateComment'
import { getSafeTypeName } from './getSafeTypeName'

export function generateFactory(ctx: Context) {
  const code: string[] = []
  const vars: string[] = []
  const objects: string[] = []
  const operations: string[] = []

  let queryVarAdded = false
  let mutationVarAdded = false
  let subscriptionVarAdded = false

  const addQueryVar = () => {
    if (!queryVarAdded) {
      queryVarAdded = true
      vars.push(`  const Q = 'query' as const`)
    }
  }

  const addMutationVar = () => {
    if (!mutationVarAdded) {
      mutationVarAdded = true
      vars.push(`  const M = 'mutation' as const`)
    }
  }

  const addSubscriptionVar = () => {
    if (!subscriptionVarAdded) {
      subscriptionVarAdded = true
      vars.push(`  const S = 'subscription' as const`)
    }
  }

  const addOperation = (
    type: 'query' | 'mutation' | 'subscription',
    typeName?: string | null
  ) => {
    if (typeName && ctx.operations[typeName]) {
      const opName = ctx.operations[typeName]

      if (ctx.code[opName]) {
        code.push(ctx.code[opName])
      }

      let requestType = `'${type}'`

      if (type === 'query') {
        requestType = queryVarAdded ? 'Q' : requestType
      }

      if (type === 'mutation') {
        requestType = mutationVarAdded ? 'M' : requestType
      }

      if (type === 'subscription') {
        requestType = subscriptionVarAdded ? 'S' : requestType
      }

      operations.push(
        `    ${type}: <T = ${typeName}, E = GraphQLError>` +
          `(operation: ${opName}, options?: Options)` +
          `: Promise<{ data?: T | null, errors?: E[] }> ` +
          `=> request(${requestType}, null, operation, options)`
      )
    }
  }

  const addObject = (
    type: 'query' | 'mutation' | 'subscription',
    typeName?: string | null
  ) => {
    if (typeName && ctx.operationFields[typeName]) {
      const fields = ctx.operationFields[typeName]
      const props: string[] = []

      let objectName = ''
      let requestType = `'${type}'`

      if (type === 'query') {
        objectName = 'queries'
        requestType = 'Q'
        addQueryVar()
      }

      if (type === 'mutation') {
        objectName = 'mutations'
        requestType = 'M'
        addMutationVar()
      }

      if (type === 'subscription') {
        objectName = 'subscriptions'
        requestType = 'S'
        addSubscriptionVar()
      }

      fields.forEach((field) => {
        let comment = ''

        if (field.description) {
          comment = generateComment(field.description, 3) + '\n'
        }

        props.push(
          comment +
            `      ${field.name}: <T = ${field.returnType}>` +
            `(fields: ${field.argsType}, options?: Options)` +
            `: Promise<T> ` +
            `=> request(${requestType}, '${field.name}', fields, options)`
        )
      })

      if (fields.length) {
        objects.push(
          [`    ${objectName}: {`, props.join(',\n'), '    }'].join('\n')
        )
      }
    }
  }

  if (!ctx.options.skipQueries) {
    addObject('query', ctx.schema.queryType.name)
  }

  if (!ctx.options.skipMutations) {
    addObject('mutation', ctx.schema.mutationType?.name)
  }

  if (!ctx.options.skipQuery) {
    addOperation('query', ctx.schema.queryType.name)
  }

  if (!ctx.options.skipMutation) {
    addOperation('mutation', ctx.schema.mutationType?.name)
  }

  // TODO add subscription?

  let exportType: string

  if (ctx.options.factoryName) {
    if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(ctx.options.factoryName)) {
      throw new Error(
        `The factory name '${ctx.options.factoryName}' is invalid.`
      )
    }

    if (ctx.identifiers[ctx.options.factoryName]) {
      throw new Error(
        `The factory name '${ctx.options.factoryName}' is ` +
          `used in the schema, please pick another name ` +
          `(i.e. '$${ctx.options.factoryName}').`
      )
    }
    ctx.factory = ctx.options.factoryName
    ctx.identifiers[ctx.factory] = 'custom'
    exportType = 'function'
  } else {
    ctx.factory = getSafeTypeName(ctx, 'createGraphQLClient')
    exportType = 'default function'
  }

  if (code.length) {
    code.push('')
  }

  const body = [...operations, ...objects]

  code.push(
    factoryTemplate
      .replace('%EXPORT_TYPE%', exportType)
      .replace('%NAME%', ctx.factory)
  )

  code.push(...vars)

  if (body.length) {
    code.push('  return {')
    code.push(body.join(',\n'))
    code.push('  }')
  } else {
    code.push('  return {}')
  }

  code.push('}')

  ctx.code[ctx.factory] = code.join('\n')
}
