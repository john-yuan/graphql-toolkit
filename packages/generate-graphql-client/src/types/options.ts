export interface ConfigurationFile {
  /**
   * Global options. Default options for every schema files.
   */
  options?: Options

  /**
   * Schema files.
   */
  files?: SchemaFile[]
}

export interface Endpoint {
  /**
   * The url to fetch schema.
   */
  url: string

  /**
   * The headers to add when requesting schema.
   */
  headers?: Record<string, any>

  /**
   * Path to a json file. The json value will be used as `headers`.
   * The path is relative the configuration file.
   */
  headersFile?: string
}

export interface SchemaFile {
  /**
   * The output path of the generated typescript file.
   * The path is relative the configuration file.
   */
  output: string

  /**
   * The filename of the schema introspection json file.
   * The path is relative the configuration file.
   */
  filename?: string

  /**
   * The endpoint to fetch the schema. If `filename` is defined,
   * `endpoint` will be ignored.
   */
  endpoint?: Endpoint | string

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

export interface Options {
  /**
   * Specify scalar types mapping. This mapping is used to map GraphQL scalar
   * types to TypeScript types. The default mapping is:
   *
   * ```json
   * {
   *    "Int": "number",
   *    "Float": "number",
   *    "String": "string",
   *    "Boolean": "boolean",
   *    "ID": "string"
   * }
   * ```
   *
   * Please note that `String` will be replaced by `string` and `Boolean` will
   * be replaced by `boolean` directly (no type alias will be generated).
   *
   * If the a scalar type is not specified, it will be mapped to `unknown`.
   */
  scalarTypes?: Record<string, string> | [string, string][]

  /**
   * Skip generating the generated tip.
   */
  skipGeneratedTip?: boolean

  /**
   * Skip generating comments for disabling lint.
   */
  skipLintComments?: boolean

  /**
   * Skip wrapping enum in the args as `{ $enum: EnumType }`.
   */
  skipWrappingEnum?: boolean

  /**
   * Skip generating `xxxArgs` types. If this option is `true`, the
   * `xxxFields` and the factory function will not be generated too.
   */
  skipArgs?: boolean

  /**
   * Skip generating `xxxFields` types. If this option is
   * `true`, the factory function will not be generated too.
   */
  skipFields?: boolean

  /**
   * Skip generating factory function.
   */
  skipFactory?: boolean

  /**
   * Skip generating `query` method.
   */
  skipQuery?: boolean

  /**
   * Skip generating `queries` object.
   */
  skipQueries?: boolean

  /**
   * Skip generating `mutation` method.
   */
  skipMutation?: boolean

  /**
   * Skip generating `mutations` object.
   */
  skipMutations?: boolean

  /**
   * Sort the types by their names.
   */
  sortTypes?: boolean

  /**
   * The file headers.
   */
  headers?: string[]

  /**
   * The file footers.
   */
  footers?: string[]
}
