import type { Options, Schema, Type, Field } from './types'

export type CodeBlockType =
  | 'operation'
  | 'built-in'
  | 'scalar'
  | 'enum'
  | 'union'
  | 'type'
  | 'input'
  | 'args'
  | 'possible-types'
  | 'fields'
  | 'factory'

export interface Operation {
  field: Field
  argsType: string
  returnType: string
}

export class Context {
  readonly schema: Schema
  readonly options: Options
  readonly queryType: Type | null
  readonly mutationType: Type | null
  readonly identifiers: Record<
    string,
    'schema' | 'built-in' | 'generated' | 'user-defined'
  >
  readonly processedTypes: Record<string, string>
  readonly processedFields: Record<string, string>
  readonly possibleTypes: Record<string, string>
  readonly unmappedScalars: string[]
  readonly operations: Record<string, Operation[]>

  private readonly codeBlocks: {
    name: string
    code: string
    type: CodeBlockType
  }[]

  constructor(schema: Schema, options: Options) {
    this.schema = schema
    this.options = options
    this.identifiers = {}
    this.processedTypes = {}
    this.processedFields = {}
    this.possibleTypes = {}
    this.codeBlocks = []
    this.unmappedScalars = []
    this.operations = {}

    let queryType: Type | null = null
    let mutationType: Type | null = null

    schema.types.forEach((item) => {
      const { name } = item

      if (name) {
        this.identifiers[name] = 'schema'
        if (name === schema.queryType?.name) {
          queryType = item
        } else if (name === schema.mutationType?.name) {
          mutationType = item
        }
      }
    })

    this.queryType = queryType
    this.mutationType = mutationType

    this.addCode('built-in', '$', `export type $<T> = T | T[]`)

    this.addCode(
      'built-in',
      '$Directive',
      `export interface $Directive {\n` +
        this.indent(1, 'name: string\n') +
        this.indent(1, 'args?: any\n') +
        `}`
    )

    this.addCode(
      'built-in',
      '$Directives',
      `export interface $Directives {\n` +
        this.indent(1, '$directives?: $<string | $Directive>\n') +
        `}`
    )

    this.addCode(
      'built-in',
      '$Scalar',
      `export type $Scalar = string | number | boolean | null | undefined`
    )

    this.addCode(
      'built-in',
      '$Options',
      `export type $Options = $Directives & {\n` +
        this.indent(1, '$alias?: string\n') +
        `}`
    )

    this.addCode(
      'built-in',
      '$Pick',
      'export type $Pick = $Scalar | $<$Options>'
    )

    this.addCode(
      'built-in',
      '$GraphQLError',
      'export interface $GraphQLError {\n' +
        this.indent(1, 'message: string\n') +
        this.indent(1, 'locations?: { line: number; column: number }[]\n') +
        this.indent(1, 'path?: (string | number)[]\n') +
        this.indent(1, 'extensions?: Record<string, any>\n') +
        '}'
    )

    this.addCode(
      'built-in',
      '$Operation',
      'export type $Operation<Fields> = Fields & $Directives & {\n' +
        this.indent(1, '__typename?: $Pick\n') +
        this.indent(1, '$name?: string\n') +
        this.indent(1, '$variables?: Record<string, string>\n') +
        this.indent(1, '$fields?: Fields[]\n') +
        '}'
    )

    this.addCode(
      'built-in',
      '$Var',
      'export type $Var = {\n' +
        this.indent(
          1,
          '/** The variable name. For example `$my_variable`. */\n'
        ) +
        this.indent(1, '$var: string\n') +
        '}'
    )

    const renameTypes = options.renameTypes || {}

    Object.keys(renameTypes).forEach((key) => {
      const targetName = renameTypes[key]

      if (targetName) {
        const used = this.identifiers[targetName]

        if (used === 'schema') {
          throw new Error(
            `Cannot rename the type '${key}' to '${targetName}'. ` +
              `Because the type name '${targetName}' is used in the ` +
              `schema. Please check your 'renameTypes' config and use ` +
              `another type name for '${key}'.`
          )
        } else if (used === 'built-in') {
          throw new Error(
            `Cannot rename the type '${key}' to '${targetName}'. ` +
              `Because the type name '${targetName}' is used ` +
              `internally. Please check your 'renameTypes' config and use ` +
              `another type name for '${key}'.`
          )
        }
      }
    })
  }

  getIndent(level: number) {
    const content = this.options.indent ?? '  '

    let indent = ''

    for (let i = 0; i < level; i += 1) {
      indent += content
    }

    return indent
  }

  indent(level: number, line: string) {
    return this.getIndent(level) + line
  }

  /**
   * Generate a safe type name.
   *
   * @example
   * // Return `UserFriendsArgs` if it is not used before,
   * // Otherwise `UserFriendsArgs1` will be returned.
   * ctx.getSafeTypeName('user', 'friends', 'args')
   */
  getSafeTypeName(...words: string[]) {
    const typeName = words
      .map((w) => w.trim().replace(/(^.)/, (v) => (v || '').toUpperCase()))
      .join('')

    let safeTypeName = typeName
    let index = 1

    while (this.identifiers[safeTypeName]) {
      safeTypeName = typeName + index
      index += 1
    }

    return safeTypeName
  }

  getNamedType(type: Type) {
    return type.name
      ? this.schema.types.find((item) => item.name === type.name)
      : null
  }

  generateComment({
    description,
    indentLevel,
    isDeprecated,
    deprecationReason,
    defaultValue
  }: {
    description?: string | null
    indentLevel?: number | null
    isDeprecated?: boolean | null
    deprecationReason?: string | null
    defaultValue?: string | null
  }) {
    let desc = description || ''

    if (defaultValue != null) {
      const text = 'Default value: `' + defaultValue + '`'
      desc += (desc ? '\n\n' : '') + text
    }

    if (isDeprecated) {
      let text = '@deprecated'
      if (deprecationReason) {
        text += ' ' + deprecationReason
      }
      desc += (desc ? '\n\n' : '') + text
    }

    if (!desc) {
      return ''
    }

    const indent = this.getIndent(indentLevel || 0)
    const comments: string[] = []

    desc
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .forEach((line) => {
        comments.push(indent + ' *' + (line ? ' ' + line : ''))
      })

    if (comments[0]) {
      comments[0] = comments[0].trim().slice(1)
    }

    return indent + '/**' + comments.join('\n') + ' */\n'
  }

  addCode(blockType: CodeBlockType, name: string, code: string) {
    if (blockType === 'built-in') {
      this.identifiers[name] = 'built-in'
    }

    this.codeBlocks.push({ type: blockType, name, code })
  }

  getCode() {
    const blocks = [...this.codeBlocks]
    const orders: CodeBlockType[] = [
      'operation',
      'scalar',
      'enum',
      'union',
      'type',
      'input',
      'built-in',
      'args',
      'possible-types',
      'fields',
      'factory'
    ]

    const getOrder = (blockType: CodeBlockType) => {
      const index = orders.indexOf(blockType)
      return index === -1 ? orders.length : index
    }

    blocks.sort((a, b) => {
      const order = getOrder(a.type) - getOrder(b.type)

      if (order === 0) {
        return a.name.localeCompare(b.name)
      }

      return order
    })

    const lines: string[] = []

    this.options.headers?.forEach((line) => {
      lines.push(line)
    })

    if (!this.options.skipGeneratedMessage) {
      lines.push(
        '/* This file was automatically generated and should not be edited. */'
      )
    }

    blocks.forEach((block) => {
      lines.push(block.code)
    })

    return lines.join('\n')
  }

  getScalarType(typeName: string) {
    const map = this.options.scalarTypes || {}
    const defaultMap: typeof map = {
      Int: 'number',
      Float: 'number',
      String: 'string',
      Boolean: 'boolean',
      ID: 'string'
    }

    const scalarType = map[typeName] || defaultMap[typeName]

    if (!scalarType && !this.unmappedScalars.includes(typeName)) {
      this.unmappedScalars.push(typeName)
    }

    return scalarType || 'unknown'
  }

  skipWrappingEnum() {
    return this.options.skipWrappingEnum
  }

  getTypeName(typeName?: string) {
    if (typeName) {
      const map = this.options.renameTypes || {}
      return map[typeName] || typeName
    }

    return ''
  }
}
