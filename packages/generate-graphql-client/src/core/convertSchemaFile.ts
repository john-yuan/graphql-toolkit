import fs from 'fs'
import { convertSchema } from './convertSchema'
import type { Endpoint, Options, Schema, SchemaFile } from './types'
import { requestIntrospection } from './requestIntrospection'

export async function convertSchemaFile(file: SchemaFile, options: Options) {
  let schema: Schema | undefined

  if (file.endpoint) {
    const endpoint: Endpoint =
      typeof file.endpoint === 'string' ? { url: file.endpoint } : file.endpoint

    let headers: Record<string, string> = endpoint.headers || {}

    if (endpoint.headersFile) {
      headers =
        JSON.parse(fs.readFileSync(endpoint.headersFile).toString()) || {}
    }

    const res = await requestIntrospection(endpoint.url, headers)

    schema = res.data.__schema
  } else if (file.filename) {
    const content = fs.readFileSync(file.filename).toString()
    const json = JSON.parse(content) as {
      __schema?: Schema
      data?: {
        __schema?: Schema
      }
    }
    schema = json.__schema || json.data?.__schema
  }

  if (schema) {
    return convertSchema(schema, options)
  } else {
    throw new Error('invalid introspection file')
  }
}
