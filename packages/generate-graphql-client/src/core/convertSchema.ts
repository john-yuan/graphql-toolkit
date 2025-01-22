import { Context } from './context'
import { generateFactory } from './generateFactory'
import { generateType } from './generateType'
import type { Options, Schema } from './types'

export function convertSchema(schema: Schema, options: Options) {
  const ctx = new Context(schema, options)

  if (ctx.queryType) {
    generateType(ctx, ctx.queryType, 'output')
  }

  if (ctx.mutationType) {
    generateType(ctx, ctx.mutationType, 'output')
  }

  generateFactory(ctx)

  return ctx
}
