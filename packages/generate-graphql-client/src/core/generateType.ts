import type { Context, Operation } from './context'
import type { InputValue, Type } from './types'
import { getRealType } from './getRealType'
import { getTypeName } from './getTypeName'

export function generateType(ctx: Context, namedType: Type) {
  const typeName = namedType.name || ''

  let fieldsTypeName = ''

  if (!typeName) {
    return { typeName, fieldsTypeName }
  }

  if (!ctx.processedTypes[typeName]) {
    ctx.processedTypes[typeName] = typeName
    generateObject(ctx, namedType, typeName)
  }

  if (namedType.kind === 'OBJECT' || namedType.kind === 'INTERFACE') {
    if (!ctx.processedFields[typeName]) {
      fieldsTypeName = ctx.getSafeTypeName(typeName, 'Fields')
      ctx.processedFields[typeName] = fieldsTypeName
      generateFields(ctx, namedType, fieldsTypeName)
    }
  }

  fieldsTypeName = fieldsTypeName || ctx.processedFields[typeName]

  return { typeName, fieldsTypeName }
}

function generateObject(ctx: Context, namedType: Type, typeName: string) {
  if (
    namedType.kind === 'OBJECT' ||
    namedType.kind === 'INTERFACE' ||
    namedType.kind === 'INPUT_OBJECT'
  ) {
    const implementNames: string[] = []

    namedType.interfaces?.forEach((interfaceType) => {
      const interfaceRealType = ctx.getTypeByName(interfaceType.name)
      if (interfaceRealType) {
        const generated = generateType(ctx, interfaceRealType)
        if (generated.typeName) {
          implementNames.push(generated.typeName)
        }
      }
    })

    const props = [ctx.indent(1, '__typename: string')]
    const fields =
      namedType.kind === 'INPUT_OBJECT'
        ? namedType.inputFields
        : namedType.fields

    fields?.forEach((field) => {
      const fieldType = getTypeName(
        field.type,
        namedType.kind === 'INPUT_OBJECT' && !ctx.skipWrappingEnum()
      )
      const required = field.type.kind === 'NON_NULL'
      const comment = ctx.generateComment({
        description: field.description,
        indentLevel: 1,
        isDeprecated: field.isDeprecated,
        deprecationReason: field.deprecationReason,
        defaultValue:
          namedType.kind === 'INPUT_OBJECT'
            ? (field as InputValue).defaultValue
            : null
      })

      const fieldRealType = ctx.getTypeByName(getRealType(field.type).name)

      if (fieldRealType) {
        generateType(ctx, fieldRealType)
      }

      props.push(
        comment +
          ctx.indent(1, field.name + (required ? ': ' : '?: ') + fieldType)
      )
    })

    let code =
      ctx.generateComment({ description: namedType.description }) +
      'export interface ' +
      typeName

    if (implementNames.length) {
      code = code + ' extends ' + implementNames.join(', ')
    }

    code = code + ' {\n' + props.join('\n') + '\n}\n'

    ctx.addCode(
      namedType.kind === 'INPUT_OBJECT' ? 'input' : 'type',
      typeName,
      code
    )
  } else if (namedType.kind === 'UNION') {
    const typeNames: string[] = []

    namedType.possibleTypes?.forEach((objectType) => {
      const objectRealType = ctx.getTypeByName(objectType.name)
      if (objectRealType) {
        const generated = generateType(ctx, objectRealType)
        if (generated.typeName) {
          typeNames.push(generated.typeName)
        }
      }
    })

    if (typeNames.length) {
      ctx.addCode(
        'union',
        typeName,
        ctx.generateComment({ description: namedType.description }) +
          `export type ${typeName} = ${typeNames.join(' | ')}\n`
      )
    }
  } else if (namedType.kind === 'ENUM') {
    const names: string[] = []

    namedType.enumValues?.forEach((item) => {
      names.push(
        item.name.includes("'") ? JSON.stringify(item.name) : `'${item.name}'`
      )
    })

    if (names.length) {
      ctx.addCode(
        'enum',
        typeName,
        ctx.generateComment({ description: getEnumDescription(namedType) }) +
          `export type ${typeName} = ${names.join(' | ')}\n`
      )
    }
  } else if (namedType.kind === 'SCALAR') {
    ctx.addCode(
      'scalar',
      typeName,
      ctx.generateComment({ description: namedType.description }) +
        'export type ' +
        typeName +
        ' = ' +
        ctx.getScalarType(typeName) +
        '\n'
    )
  }
}

function generateFields(ctx: Context, namedType: Type, fieldsTypeName: string) {
  const props: string[] = [ctx.indent(1, '__typename?: $Pick')]
  const operations: Operation[] = []

  namedType.fields?.forEach((field) => {
    const realType = ctx.getTypeByName(getRealType(field.type).name)
    const comment = ctx.generateComment({
      description: field.description,
      indentLevel: 1,
      deprecationReason: field.deprecationReason,
      isDeprecated: field.isDeprecated
    })

    if (realType) {
      let argsTypeName = ''
      let argsRequired = false

      if (field.args.length) {
        argsTypeName = ctx.getSafeTypeName(
          namedType.name || '',
          field.name,
          'Args'
        )
        argsRequired = field.args.some((val) => {
          return val.defaultValue == null && val.type.kind === 'NON_NULL'
        })

        generateArgs(ctx, argsTypeName, field.args)
      }

      let fieldsType: string
      let operationArgsType: string

      if (
        realType.kind === 'OBJECT' ||
        realType.kind === 'INTERFACE' ||
        realType.kind === 'UNION'
      ) {
        const fieldsTypes: string[] = []
        const generated = generateType(ctx, realType)

        if (generated.fieldsTypeName) {
          fieldsTypes.push(generated.fieldsTypeName)
        }

        if (argsTypeName) {
          if (argsRequired) {
            fieldsTypes.push(`{ $args: ${argsTypeName} }`)
          } else {
            fieldsTypes.push(`{ $args?: ${argsTypeName} }`)
          }
        }

        if (realType.kind !== 'OBJECT') {
          const possibleTypesName = getPossibleTypes(ctx, realType)

          if (possibleTypesName) {
            fieldsTypes.push(possibleTypesName)
          }
        }

        fieldsTypes.push('$Options')

        fieldsType = fieldsTypes.join(' & ')
        operationArgsType = fieldsType
        fieldsType = '$<' + fieldsType + '>'
      } else {
        fieldsType = '$Pick'

        if (argsTypeName) {
          if (argsRequired) {
            fieldsType = `$<$Options & { $args: ${argsTypeName} }>`
          } else {
            fieldsType = `$Scalar | $<$Options & { $args?: ${argsTypeName} }>`
          }
        }

        operationArgsType = fieldsType
      }

      operations.push({
        field,
        argsType: operationArgsType,
        returnType: getTypeName(field.type, false)
      })

      props.push(comment + ctx.indent(1, field.name + '?: ' + fieldsType))
    }
  })

  const typeName = namedType.name

  if (typeName) {
    ctx.operations[typeName] = operations
  }

  ctx.addCode(
    'fields',
    fieldsTypeName,
    `export interface ${fieldsTypeName} {\n${props.join('\n')}\n}\n`
  )
}

function generateArgs(ctx: Context, argsTypeName: string, args: InputValue[]) {
  const props: string[] = []

  args.forEach((arg) => {
    const argType = getTypeName(arg.type, !ctx.skipWrappingEnum())
    const realType = ctx.getTypeByName(getRealType(arg.type).name)
    const required = arg.defaultValue == null && arg.type.kind === 'NON_NULL'

    if (realType) {
      generateType(ctx, realType)
    }

    let code: string

    if (required) {
      code = arg.name + ': ' + argType
    } else {
      code = arg.name + '?: ' + argType
    }

    const comment = ctx.generateComment({
      description: arg.description,
      defaultValue: arg.defaultValue,
      isDeprecated: arg.isDeprecated,
      deprecationReason: arg.deprecationReason,
      indentLevel: 1
    })

    props.push(comment + ctx.indent(1, code))
  })

  const block = `export interface ${argsTypeName} {\n${props.join('\n')}\n}\n`

  ctx.addCode('args', argsTypeName, block)
}

function getEnumDescription(type: Type) {
  let desc = (type.description || '') + '\n'

  type.enumValues?.forEach((item) => {
    if (item.description) {
      desc += '\n- '

      if (item.isDeprecated) {
        desc += '~~`' + item.name + '`~~ (deprecated) '
      } else {
        desc += '`' + item.name + '`'
      }

      desc += item.description
    }
  })

  return desc.trim()
}

function getPossibleTypes(ctx: Context, realType: Type) {
  const props: string[] = []

  const typeName = realType.name || ''

  if (ctx.possibleTypes[typeName] != null) {
    return ctx.possibleTypes[typeName]
  }

  realType.possibleTypes?.forEach((item) => {
    const itemRealType = ctx.getTypeByName(item.name)
    if (itemRealType) {
      const { typeName, fieldsTypeName } = generateType(ctx, itemRealType)
      if (typeName && fieldsTypeName) {
        props.push(
          ctx.indent(2, typeName + '?: $<' + fieldsTypeName + ' & $Directives>')
        )
      }
    }
  })

  if (props.length) {
    const possibleTypesName = ctx.getSafeTypeName(typeName, 'PossibleTypes')

    ctx.addCode(
      'possible-types',
      possibleTypesName,
      `export interface ${possibleTypesName} {\n` +
        ctx.indent(1, '__typename?: $Pick\n') +
        ctx.indent(1, '$on?: {\n' + props.join('\n') + '\n') +
        ctx.indent(1, '}\n') +
        '}\n'
    )

    ctx.possibleTypes[typeName] = possibleTypesName
  } else {
    ctx.possibleTypes[typeName] = ''
  }

  return ctx.possibleTypes[typeName]
}
