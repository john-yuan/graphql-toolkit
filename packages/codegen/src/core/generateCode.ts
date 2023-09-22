import type { Context } from '../types/context'

export function generateCode(ctx: Context) {
  const code: string[] = []
  const {
    skipArgs,
    skipFields,
    skipFactory,
    headers,
    skipGeneratedTip,
    skipLintComments,
    footers
  } = ctx.options

  const ensureEmptyLine = () => {
    if (code.length && code[code.length - 1] !== '') {
      code.push('')
    }
  }

  const addBlock = (block: string) => {
    ensureEmptyLine()
    code.push(block)
  }

  const addTypes = (typeNames: string[]) => {
    typeNames.forEach((name) => {
      if (ctx.code[name]) {
        addBlock(ctx.code[name])
      }
    })
  }

  headers?.forEach((line) => code.push(line))

  if (!skipGeneratedTip) {
    code.push(
      '/* This file was automatically generated and should not be edited. */'
    )
  }

  if (!skipLintComments) {
    code.push('/* eslint-disable */')
    code.push('/* tslint:disable */')
  }

  ensureEmptyLine()

  addTypes(ctx.schemaTypes)

  if (!skipArgs) {
    addTypes(ctx.args)

    if (!skipFields) {
      code.push(ctx.builtinTypes)
      addTypes(ctx.fields)

      if (!skipFactory) {
        addTypes([ctx.factory])
      }
    }
  }

  footers?.forEach((line) => code.push(line))

  ensureEmptyLine()

  return code.join('\n')
}
