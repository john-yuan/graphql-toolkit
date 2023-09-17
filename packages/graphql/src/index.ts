export type List<T> = T | T[]

export interface Definition {
  query?: Operation
  mutation?: Operation
  subscription?: Operation
  fragments?: List<FragmentDeclarations>
}

export interface Operation {
  /**
   * Optional operation name.
   */
  $name?: string

  /**
   * Optional variable definitions.
   *
   * @example
   * {
   *   $status: "Int",
   *   $codes: "[String!] = []"
   * }
   */
  $variables?: Record<string, string>

  /**
   * Optional directives.
   *
   * @example
   * {
   *   name: '@skip',
   *   args: { if: true }
   * }
   */
  $directives?: Directives

  /**
   * Optional fragments to use.
   */
  $fragments?: Fragment[]

  /**
   * Optional fields.
   */
  $fields?: {
    $fragments?: Fragment[]
    [key: string]: FieldValue
  }[]

  /**
   * Any other selection.
   */
  [key: string]: FieldValue
}

export interface Field {
  $alias?: string
  $args?: Args

  $directives?: Directive
  $fragments?: Fragment[]

  $content?: string
  $body?: string

  [key: string]: FieldValue
}

export type FieldValue =
  | boolean
  | null
  | number
  | object
  | string
  | undefined
  | Field
  | Field[]

export type Args = Record<string, ArgValue>

export type ArgValue =
  | boolean
  | null
  | number
  | string
  | undefined
  | ArgValue[]
  | {
      /**
       * @example { $enum: 'DESC' }
       */
      $enum: string | null | undefined
    }
  | {
      /**
       * @example { $var: '$keyword' }
       */
      $var: string | null | undefined
    }
  | {
      /**
       * @example { $raw: 123 }
       */
      $raw: string | number | boolean | null | undefined
    }
  | {
      /**
       * A flag to keep the value even it is an empty object.
       */
      $keep?: ArgValue

      /**
       * Nested arguments.
       */
      [key: string]: ArgValue
    }

export type Directives = List<string | Directive>

export interface Directive {
  /**
   * Directive name, must start with `@`. Example: `@skip`.
   */
  name: string

  /**
   * Optional directive arguments.
   */
  args?: Args
}

export interface FragmentDeclarations {
  [name: string]: FragmentDefinition
}

export interface FragmentDefinition {
  $directives?: Directives
  $on: string
  $fragments?: Fragment[]
  [key: string]: FieldValue
}

export type Fragment = FragmentSpread | { inline: InlineFragment }

export interface FragmentSpread {
  spread: string
  directives?: Directives
}

export interface InlineFragment {
  $on?: string
  $directives?: Directives
  $fragments?: Fragment[]

  [key: string]: FieldValue
}

export interface Options {
  indent?: number
  indentChar?: string
}

export const generateGraphQL = (function () {
  function generateGraphQL(definition: Definition, options?: Options) {
    const opts = {
      indent: (options || {}).indent || 0,
      indentChar: (options || {}).indentChar
    }

    const doc: string[] = []

    const parse = (type: 'query' | 'mutation' | 'subscription') => {
      const op = definition[type]
      if (op) {
        let code: string = createIndent(opts.indent, opts.indentChar) + type
        code = append(code, op.$name)

        const { $variables, $directives, $fields } = op

        if ($variables) {
          const vars: string[] = []
          const varIndent = createIndent(opts.indent + 1, opts.indentChar)

          Object.keys($variables).forEach((key) => {
            const val = $variables[key]
            if (val) {
              vars.push(varIndent + key + ': ' + val)
            }
          })

          if (vars.length) {
            code +=
              ' (\n' +
              vars.join('\n') +
              '\n' +
              createIndent(opts.indent, opts.indentChar) +
              ')'
          }
        }

        if ($directives) {
          code = append(
            code,
            encodeDirectives($directives, opts.indent, opts.indentChar)
          )
        }

        const fields: Field[] = []

        if ($fields) {
          $fields.forEach((filed) => fields.push(filed))
        }

        fields.push(op as Field)

        const body = encodeFields(fields, opts)

        if (body) {
          doc.push(code + ' ' + body)
        }
      }
    }

    parse('query')
    parse('mutation')
    parse('subscription')

    each(definition.fragments, (fragments: FragmentDeclarations) => {
      const code = encodeFragments(fragments, opts)
      if (code) {
        doc.push(code)
      }
    })

    return doc.join('\n\n')
  }

  function encodeFragments(
    fragments: FragmentDeclarations,
    options: {
      indent: number
      indentChar?: string
    }
  ) {
    const code: string[] = []
    const indent = createIndent(options.indent, options.indentChar)

    Object.keys(fragments).forEach((key) => {
      const fragment = fragments[key]

      if (fragment) {
        const body = encodeFields(fragment as Field, options)
        if (body) {
          code.push(
            append(
              indent + 'fragment ' + key + ' on ' + fragment.$on,
              encodeDirectives(
                fragment.$directives,
                options.indent,
                options.indentChar
              )
            ) +
              ' ' +
              body
          )
        }
      }
    })

    return code.join('\n\n')
  }

  function encodeFields(
    fields: List<Field>,
    options: {
      indent: number
      indentChar?: string
    }
  ) {
    const { indent, indentChar } = options
    const code: string[] = []
    const propIndent = createIndent(indent + 1, indentChar)

    const generateSubField = (key: string, subField: Field) => {
      if (subField.$content) {
        code.push(propIndent + subField.$content)
      } else {
        let prop = ''

        if (subField.$alias) {
          prop = subField.$alias + ': '
        }

        prop += key

        if (subField.$args) {
          prop = append(
            prop,
            encodeArgs(subField.$args, {
              indent: indent + 1,
              indentChar
            })
          )
        }

        if (subField.$directives) {
          prop = append(
            prop,
            encodeDirectives(subField.$directives, indent + 1, indentChar)
          )
        }

        if (subField.$body) {
          prop += ' ' + subField.$body
        } else {
          prop = append(
            prop,
            encodeFields(subField, {
              indent: indent + 1,
              indentChar
            })
          )
        }

        code.push(propIndent + prop)
      }
    }

    each(fields, (field) => {
      Object.keys(field).forEach((key) => {
        const val = field[key]

        if (key[0] === '$') {
          if (key === '$fragments') {
            each(val as Fragment[], (frag) => {
              if ((frag as FragmentSpread).spread) {
                code.push(
                  append(
                    propIndent + '...' + (frag as FragmentSpread).spread,
                    encodeDirectives(
                      (frag as FragmentSpread).directives,
                      indent + 1,
                      indentChar
                    )
                  )
                )
              } else {
                const { inline } = frag as { inline: InlineFragment }

                let inlineFrag = propIndent + '...'

                if (inline.$on) {
                  inlineFrag += ' on ' + inline.$on
                }

                const directiveBody = encodeFields(inline as Field, {
                  indent: indent + 1,
                  indentChar
                })

                if (directiveBody) {
                  code.push(
                    append(
                      inlineFrag,
                      encodeDirectives(
                        inline.$directives,
                        indent + 1,
                        indentChar
                      )
                    ) +
                      ' ' +
                      directiveBody
                  )
                }
              }
            })
          }
        } else if (val) {
          if (typeof val === 'boolean' || typeof val === 'number') {
            code.push(propIndent + key)
          } else if (typeof val === 'string') {
            code.push(propIndent + val + ': ' + key)
          } else if (Array.isArray(val)) {
            val.forEach((subField) => generateSubField(key, subField))
          } else {
            generateSubField(key, val as Field)
          }
        }
      })
    })

    return code.length
      ? '{\n' + code.join('\n') + '\n' + createIndent(indent, indentChar) + '}'
      : ''
  }

  function encodeArgs(
    args: Record<string, any>,
    options: {
      indent: number
      indentChar?: string
      object?: boolean
    }
  ) {
    const { object, indent, indentChar } = options
    const propIndent = createIndent(indent + 1, indentChar)
    const code: string[] = []

    let keep = false

    Object.keys(args).forEach((key) => {
      const val = getArgValue(args[key], indent, indentChar)
      if (val) {
        if (key[0] === '$') {
          if (key === '$keep' && args[key] && object) {
            keep = true
          }
        } else {
          code.push(propIndent + key + ': ' + val)
        }
      }
    })

    if (code.length) {
      const body = code.join('\n') + '\n' + createIndent(indent, indentChar)
      return object ? '{\n' + body + '}' : '(\n' + body + ')'
    }

    return keep ? '{}' : ''
  }

  function getArgValue(
    value: ArgValue,
    indent: number,
    indentChar?: string
  ): string {
    if (value !== undefined) {
      const type = typeof value

      if (type === 'number' || type === 'boolean' || value === null) {
        return '' + value
      } else if (type === 'string') {
        return JSON.stringify(value)
      } else if (Array.isArray(value)) {
        const list: string[] = []
        value.forEach((elem) => {
          const item = getArgValue(elem, indent, indentChar)
          if (item) {
            list.push(item)
          }
        })
        return '[' + list.join(', ') + ']'
      } else {
        const keys = Object.keys(value as any)

        if (
          keys.length === 1 &&
          ['$enum', '$var', '$raw'].indexOf(keys[0]) > -1
        ) {
          const val = (value as any)[keys[0]]
          return val === undefined ? '' : '' + val
        }

        return encodeArgs(value as any, {
          indent: indent + 1,
          object: true,
          indentChar
        })
      }
    }

    return ''
  }

  function encodeDirectives(
    directive: Directives | undefined,
    indent: number,
    indentChar?: string
  ): string {
    if (typeof directive === 'string') {
      return directive
    } else if (Array.isArray(directive)) {
      return directive
        .map((el) => encodeDirectives(el, indent, indentChar))
        .join(' ')
    } else if (directive) {
      let str = directive.name || ''

      if (str && directive.args) {
        str = append(
          str,
          encodeArgs(directive.args, {
            indent,
            indentChar
          })
        )
      }

      return str
    }

    return ''
  }

  function createIndent(size: number, char?: string) {
    return Array(size + 1).join(char || '  ')
  }

  function each<T = any>(
    arr: List<T> | undefined,
    callback: (value: T) => void
  ) {
    if (Array.isArray(arr)) {
      arr.forEach(callback)
    } else if (arr) {
      callback(arr)
    }
  }

  function append(to: string, value?: string) {
    return value ? to + ' ' + value : to
  }

  return generateGraphQL
})()

export default generateGraphQL
