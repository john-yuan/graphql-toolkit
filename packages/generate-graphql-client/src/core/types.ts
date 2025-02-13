export interface Configuration {
  /**
   * Global options. Default options for every schema files.
   */
  options?: Options

  /**
   * Schema files.
   */
  files?: SchemaFile[]
}

export interface SchemaFile {
  /**
   * The endpoint to fetch the schema introspection json file.
   * If `endpoint` is set, the `filename` option will be ignored.
   */
  endpoint?: string | Endpoint

  /**
   * Specify the file path to the introspection json file.
   * If `endpoint` is set, this option will be ignored.
   *
   * If the configuration is written in a JSON file,
   * the path is relative to that JSON file.
   */
  filename?: string

  /**
   * The output path of the generated typescript file.
   *
   * If the configuration is written in a JSON file,
   * the path is relative to that JSON file.
   */
  output: string

  /**
   * The options of the current schema file. If a option of `options` is
   * not set or set to `null`, the corresponding option in global options
   * will be used.
   */
  options?: Options

  /**
   * By default, `options.scalarTypes` will extend the `scalarTypes`
   * defined in the global options. You can set `skipGlobalScalarTypes`
   * to avoid this.
   */
  skipGlobalScalarTypes?: boolean

  /**
   * Skip this file.
   */
  skip?: boolean
}

export interface Endpoint {
  /**
   * The endpoint url.
   */
  url: string

  /**
   * Specify the request headers.
   */
  headers?: Record<string, any>

  /**
   * Path to a JSON file. The content will be used as `headers`.
   */
  headersFile?: string
}

export interface Options {
  /**
   * Specify the indent. The default value is 2 spaces.
   */
  indent?: string

  /**
   * Specify scalar types mapping. This mapping is used to map GraphQL scalar
   * types to TypeScript types. The default mapping is:
   *
   * ```json
   * {
   *   "ID": "string",
   *   "Int": "number",
   *   "Float": "number"
   * }
   * ```
   *
   * Please note that `String` will be replaced by `string` and `Boolean` will
   * be replaced by `boolean` directly (no type alias will be generated).
   *
   * If the a scalar type is not specified, it will be mapped to `unknown`.
   */
  scalarTypes?: Record<string, string | null | undefined>

  /**
   * Rename the type in the schema to a custom name. For example:
   *
   * ```json
   * {
   *   "Phone": "CellPhone"
   * }
   * ```
   *
   * The above config will rename the type `Phone` to `CellPhone`.
   *
   * Please note that the custom name cannot be used in the schema, and
   * cannot be the built-in names. Otherwise, an error will be thrown.
   *
   * Normally, you will not use this option. This option is designed to
   * fix conflicts. For example, a schema may define a scalar named
   * `BigInt`. The type name `BigInt` conflicts with `window.BigInt`.
   * The lint tool may complain about this. To avoid this, we can use
   * this option to rename `BigInt` to `_BigInt` in the generated code.
   */
  renameTypes?: Record<string, string | null | undefined>

  /**
   * The file headers.
   */
  headers?: string[]

  /**
   * Skip generating the generated message.
   */
  skipGeneratedMessage?: boolean

  /**
   * Skip wrapping enum in the args as `{ $enum: EnumType }`.
   */
  skipWrappingEnum?: boolean

  /**
   * Skip generating factory function.
   */
  skipFactory?: boolean

  /**
   * Skip generating `queries` object.
   */
  skipQueries?: boolean

  /**
   * Skip generating `mutations` object.
   */
  skipMutations?: boolean

  /**
   * By default the `__typename` field in the response objects is an
   * optional string. You can set this option to `true` to make it a
   * required string.
   */
  markTypenameAsRequired?: boolean
}

export interface Schema {
  description?: string
  types: Type[]
  queryType?: Type
  mutationType?: Type
  subscriptionType?: Type
  directives: Directive[]
}

export interface Type {
  kind: TypeKind
  name?: string
  description?: string
  fields?: Field[]
  interfaces?: Type[]
  possibleTypes?: Type[]
  enumValues?: EnumValue[]
  inputFields?: InputValue[]
  ofType?: Type
  specifiedByURL?: string
}

export type TypeKind =
  | 'SCALAR'
  | 'OBJECT'
  | 'INTERFACE'
  | 'UNION'
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'LIST'
  | 'NON_NULL'

export interface Field {
  name: string
  description?: string
  args: InputValue[]
  type: Type
  isDeprecated: boolean
  deprecationReason?: string
}

export interface EnumValue {
  name: string
  description?: string
  isDeprecated: boolean
  deprecationReason?: string
}

export interface InputValue {
  name: string
  description?: string
  type: Type
  defaultValue?: string
  isDeprecated?: boolean
  deprecationReason?: string
}

export interface Directive {
  name: string
  description?: string
  locations: DirectiveLocation[]
  args: InputValue[]
  isRepeatable: boolean
}

export type DirectiveLocation =
  | 'QUERY'
  | 'MUTATION'
  | 'SUBSCRIPTION'
  | 'FIELD'
  | 'FRAGMENT_DEFINITION'
  | 'FRAGMENT_SPREAD'
  | 'INLINE_FRAGMENT'
  | 'VARIABLE_DEFINITION'
  | 'SCHEMA'
  | 'SCALAR'
  | 'OBJECT'
  | 'FIELD_DEFINITION'
  | 'ARGUMENT_DEFINITION'
  | 'INTERFACE'
  | 'UNION'
  | 'ENUM'
  | 'ENUM_VALUE'
  | 'INPUT_OBJECT'
  | 'INPUT_FIELD_DEFINITION'
