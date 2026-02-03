import { Context } from './context'
import { generateFactory } from './generateFactory'
import { generateType } from './generateType'
import type { Options, Schema } from './types'

export function convertSchema(schema: Schema, options: Options) {
  const ctx = new Context(schema, options)

  let queryFields = 'never'
  let mutationFields = 'never'

  if (ctx.queryType) {
    queryFields = generateType(ctx, ctx.queryType).fieldsTypeName
  }

  if (ctx.mutationType) {
    mutationFields = generateType(ctx, ctx.mutationType).fieldsTypeName
  }

  generateFactory(ctx)

  let typeName = ctx.getSafeTypeName('GraphqlOperation')

  if (typeName !== 'GraphqlOperation') {
    typeName = '$GraphqlOperation'
  }

  const comment = ctx.generateComment({
    description: 'The GraphQL operation.'
  })

  ctx.addCode(
    'operation',
    typeName,
    `${comment}export type ${typeName} = {\n` +
      ctx.indent(1, `query?: $Operation<${queryFields}>\n`) +
      ctx.indent(1, `mutation?: $Operation<${mutationFields}>\n`) +
      `}`
  )

  return ctx
}
