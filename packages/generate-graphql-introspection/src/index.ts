import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'
import { buildSchema } from 'graphql'
import { introspectionFromSchema } from 'graphql/utilities'

import type { IgnoreLike } from 'glob'
import type { IntrospectionOptions } from 'graphql/utilities'

export interface Options {
  source: string[]
  output: string
  ignore?: string | string[] | IgnoreLike
  cwd?: string
  introspectionOptions?: IntrospectionOptions
  log?: (message: string) => void
}

export function generateGraphQLIntrospection(options: Options) {
  if (!options.source.length) {
    throw new Error('The source is not specified.')
  }

  if (!options.output) {
    throw new Error('The output is not specified.')
  }

  const outputDir = path.dirname(options.output)

  fs.mkdirSync(outputDir, { recursive: true })

  const cwd = options.cwd ?? process.cwd()
  const files = globSync(options.source, {
    absolute: true,
    ignore: options.ignore,
    cwd
  })

  if (!files.length) {
    throw new Error('File does not exist: ' + options.source)
  }

  const schema = files
    .map((filename) => {
      const relativePath = path.relative(cwd, filename)
      options.log?.('Reading: ' + relativePath)
      return fs.readFileSync(filename).toString()
    })
    .join('\n\n')
    .trim()

  if (!schema) {
    throw new Error('The schema is empty.')
  }

  const introspection = introspectionFromSchema(
    buildSchema(schema),
    options.introspectionOptions || {
      descriptions: true,
      directiveIsRepeatable: true,
      inputValueDeprecation: true,
      oneOf: true,
      schemaDescription: true,
      specifiedByUrl: true
    }
  )

  fs.writeFileSync(options.output, JSON.stringify(introspection, null, 2))

  return introspection
}
