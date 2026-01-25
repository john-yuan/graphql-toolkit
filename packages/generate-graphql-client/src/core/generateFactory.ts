import type { Context, Operation } from './context'

export function generateFactory(ctx: Context) {
  const queryTypeName = ctx.getTypeName(ctx.queryType?.name)
  const mutationTypeName = ctx.getTypeName(ctx.mutationType?.name)

  let queryVarAdded = false
  let mutationVarAdded = false

  const vars: string[] = []
  const operations: string[] = []
  const queryProps: string[] = []
  const queryNames: string[] = []
  const mutationProps: string[] = []
  const mutationNames: string[] = []

  const addQueryVar = () => {
    if (!queryVarAdded) {
      queryVarAdded = true
      vars.push(`const Q = 'query' as const`)
    }
  }

  const addMutationVar = () => {
    if (!mutationVarAdded) {
      mutationVarAdded = true
      vars.push(`const M = 'mutation' as const`)
    }
  }

  const addOperations = (
    name: 'query' | 'mutation',
    operations: Operation[]
  ) => {
    let objectProps: string[]
    let objectPropNames: string[]

    if (name === 'query') {
      addQueryVar()
      objectProps = queryProps
      objectPropNames = queryNames
    } else if (name === 'mutation') {
      addMutationVar()
      objectProps = mutationProps
      objectPropNames = mutationNames
    }

    operations.forEach((op) => {
      const comment = ctx.generateComment({
        description: op.field.description,
        isDeprecated: op.field.isDeprecated,
        deprecationReason: op.field.deprecationReason
      })

      objectPropNames.push(op.field.name)
      objectProps.push(
        comment +
          op.field.name +
          `: <T = ${op.returnType}>(payload: ${op.argsType}, ` +
          `options?: Options) => Promise<T>`
      )
    })
  }

  const addFunction = (name: 'query' | 'mutation', typeName: string) => {
    let requestType = `'${name}'`

    if (name === 'query') {
      requestType = queryVarAdded ? 'Q' : requestType
    }

    if (name === 'mutation') {
      requestType = mutationVarAdded ? 'M' : requestType
    }

    const fields = ctx.processedFields[typeName]

    operations.push(
      `${name}: <T = ${typeName}, E = GraphQLError>` +
        `(payload: $Operation<${fields}>, options?: Options)` +
        `: Promise<{ data?: T | null, errors?: E[] }> ` +
        `=> request(${requestType}, null, payload, options)`
    )
  }

  if (queryTypeName) {
    const operations = ctx.operations[queryTypeName]
    if (operations && operations.length) {
      addOperations('query', operations)
    }
  }

  if (mutationTypeName) {
    const operations = ctx.operations[mutationTypeName]
    if (operations && operations.length) {
      addOperations('mutation', operations)
    }
  }

  if (queryTypeName) {
    addFunction('query', queryTypeName)
  }

  if (mutationTypeName) {
    addFunction('mutation', mutationTypeName)
  }

  const lines: string[] = []

  const write = (indent: number, content: string) => {
    lines.push(ctx.indent(indent, content))
  }

  write(
    0,
    'export default function createGraphQLClient' +
      '<Options = any, GraphQLError = $GraphQLError>('
  )

  write(1, 'request: (')
  write(2, '/**')
  write(2, ' * Operation type.')
  write(2, ' */')
  write(2, "type: 'query' | 'mutation',")
  write(0, '')

  write(2, '/**')
  write(2, ' * The operations name.')
  write(2, ' *')
  write(2, ' * If `name` is `null`, means that the caller is `query()` or')
  write(2, ' * `mutation()`. If `name` is a string, means that the caller')
  write(2, ' * is `queries.xxx()` or `mutations.xxx()`.')
  write(2, ' */')
  write(2, 'name: string | null,')
  write(0, '')

  write(2, '/**')
  write(2, ' * The request payload.')
  write(2, ' *')
  write(2, ' * If `name` is `null`, `payload` is the first parameter of')
  write(2, ' * `query()` or `mutation()`. If `name` is a string, `payload`')
  write(2, ' * is the first parameter of `queries.xxx()` or `mutations.xxx()`.')
  write(2, ' */')
  write(2, 'payload: any,')
  write(0, '')

  write(2, '/**')
  write(2, ' * Custom options. The second parameter of the client methods.')
  write(2, ' */')
  write(2, 'options?: Options')
  write(1, ') => Promise<any>')
  write(0, ') {')

  const hasOperations = operations.length > 0
  const hasQueries = !!(!ctx.options.skipQueries && queryProps.length)
  const hasMutations = !!(!ctx.options.skipMutations && mutationProps.length)
  const hasBody = hasOperations || hasQueries || hasMutations

  if (hasBody) {
    vars.forEach((line) => write(1, line))

    let attachAdded = false
    const addAttach = () => {
      if (attachAdded) {
        return
      }

      attachAdded = true

      write(
        1,
        `const attach = (operation: 'query' | 'mutation', methods: string) => {`
      )
      write(2, 'const operations = {} as any')
      write(2, `methods.split('/').forEach((key) => {`)
      write(
        3,
        'operations[key] = (payload: any, options?: any) => request(operation, key, payload, options)'
      )
      write(2, '})')
      write(2, 'return operations')
      write(1, '}')
    }

    const generateObject = (type: 'query' | 'mutation', names: string[]) => {
      const varname = type === 'query' ? 'queries' : 'mutations'
      const operation = type === 'query' ? 'Q' : 'M'
      const methods = JSON.stringify(names.join('/'))
      write(1, `const ${varname} = attach(${operation}, ${methods})`)
    }

    if (hasQueries) {
      addAttach()
      generateObject('query', queryNames)
    }

    if (hasMutations) {
      addAttach()
      generateObject('mutation', mutationNames)
    }

    write(1, 'return {')

    operations.forEach((line, index, array) => {
      let end = ','

      if (index + 1 === array.length) {
        if (!hasQueries && !hasMutations) {
          end = ''
        }
      }

      return write(2, line + end)
    })

    if (hasQueries) {
      write(2, 'queries: queries as {')
      queryProps.forEach((line, index, array) => {
        const prop = line
          .split(/\n/)
          .map((code) => ctx.indent(3, code))
          .join('\n')
        write(0, prop + (index + 1 === array.length ? '' : ','))
      })
      write(2, '}' + (hasMutations ? ',' : ''))
    }

    if (hasMutations) {
      write(2, 'mutations: mutations as {')
      mutationProps.forEach((line, index, array) => {
        const prop = line
          .split(/\n/)
          .map((code) => ctx.indent(3, code))
          .join('\n')
        write(0, prop + (index + 1 === array.length ? '' : ','))
      })
      write(2, '}')
    }

    write(1, '}')
  } else {
    write(1, 'return {}')
  }

  write(0, '}')

  if (!ctx.options.skipFactory) {
    ctx.addCode('factory', 'generateFactory', lines.join('\n') + '\n')
  }
}
