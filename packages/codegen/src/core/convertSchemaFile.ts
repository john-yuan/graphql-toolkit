import fs from 'fs'
import type { Options, SchemaFile } from '../types/options'
import type { Introspection } from '../types/introspection'
import { requestIntrospection } from './requestIntrospection'
import { convertSchema } from './convertSchema'
import { resolveSchemaFileOptions } from './resolveSchemaFileOptions'

export async function convertSchemaFile(
  file: SchemaFile,
  globalOptions?: Options
) {
  let introspection: Introspection | null = null

  if (file.filename) {
    introspection = JSON.parse(
      fs.readFileSync(file.filename).toString()
    ) as Introspection
  } else if (file.endpoint?.url) {
    let headers: Record<string, string> = file.endpoint.headers || {}
    if (file.endpoint.headersFile) {
      headers =
        JSON.parse(fs.readFileSync(file.endpoint.headersFile).toString()) || {}
    }
    introspection = await requestIntrospection(file.endpoint?.url, headers)
  }

  return introspection
    ? convertSchema(
        introspection.data.__schema,
        resolveSchemaFileOptions(file, globalOptions)
      )
    : null
}
