import fs from 'fs'
import type { Endpoint, Options, SchemaFile } from '../types/options'
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
  } else if (file.endpoint) {
    const endpoint: Endpoint =
      typeof file.endpoint === 'string' ? { url: file.endpoint } : file.endpoint

    let headers: Record<string, string> = endpoint.headers || {}
    if (endpoint.headersFile) {
      headers =
        JSON.parse(fs.readFileSync(endpoint.headersFile).toString()) || {}
    }
    introspection = await requestIntrospection(endpoint.url, headers)
  }

  return introspection
    ? convertSchema(
        introspection.data.__schema,
        resolveSchemaFileOptions(file, globalOptions)
      )
    : null
}
