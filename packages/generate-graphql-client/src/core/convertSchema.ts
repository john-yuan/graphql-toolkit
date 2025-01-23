import { Context } from './context'
import { generateFactory } from './generateFactory'
import { generateType } from './generateType'
import type { Options, Schema } from './types'

export function convertSchema(schema: Schema, options: Options) {
  const ctx = new Context(schema, options)

  if (ctx.queryType) {
    generateType(ctx, ctx.queryType)
  }

  if (ctx.mutationType) {
    generateType(ctx, ctx.mutationType)
  }

  generateFactory(ctx)

  return ctx
}
