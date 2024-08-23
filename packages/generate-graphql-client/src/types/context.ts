import type { Schema } from './introspection'
import type { Options } from './options'

export interface Context {
  schema: Schema
  options: Options
  builtinTypes: string
  identifiers: Record<string, 'schema' | 'generated' | undefined>
  code: Record<string, string>
  schemaTypes: string[]

  scalars: string[]
  objects: string[]
  interfaces: string[]
  inputObjects: string[]
  enums: string[]
  unions: string[]
  args: string[]
  fields: string[]
  operations: Record<string, string>
  factory: string

  operationFields: Record<string, OperationField[]>
  unmappedScalars: string[]
}

export interface OperationField {
  name: string
  argsType: string
  returnType: string
  returnTypeNonNull: boolean
  description: string
}
