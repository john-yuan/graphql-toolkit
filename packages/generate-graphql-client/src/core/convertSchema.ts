import type { Schema } from '../types/introspection'
import type { Options } from '../types/options'
import type { Context } from '../types/context'
import { generateEnum } from './generateEnum'
import { generateObject } from './generateObject'
import { generateScalar } from './generateScalar'
import { generateUnion } from './generateUnion'
import { resolveScalarTypes } from './resolveScalarTypes'
import { builtinTypes } from './builtinTypes'
import { generateArgsAndFields } from './generateArgsAndFields'
import { generateFactory } from './generateFactory'
import { generateCode } from './generateCode'

export function convertSchema(schema: Schema, options: Options = {}) {
  const scalarTypes: Record<string, string> = {}
  const ctx: Context = {
    schema,
    options,
    builtinTypes,
    identifiers: {},
    code: {},
    schemaTypes: [],
    scalars: [],
    objects: [],
    interfaces: [],
    inputObjects: [],
    enums: [],
    unions: [],
    args: [],
    fields: [],
    operations: {},
    operationFields: {},
    unmappedScalars: [],
    factory: ''
  }

  if (options.sortTypes) {
    schema.types.sort((a, b) => {
      return `${a.name ?? ''}`.localeCompare(`${b.name ?? ''}`)
    })
  }

  resolveScalarTypes(options.scalarTypes).forEach(([scalar, typeName]) => {
    if (!scalarTypes[scalar]) {
      scalarTypes[scalar] = typeName
    }
  })

  schema.types.forEach((type) => {
    if (type.name) {
      ctx.identifiers[type.name] = 'schema'

      if (type.kind === 'OBJECT') {
        ctx.schemaTypes.push(type.name)
        ctx.objects.push(type.name)
        ctx.code[type.name] = generateObject(
          type,
          type.fields || [],
          options.skipWrappingEnum
        )
      } else if (type.kind === 'INTERFACE') {
        ctx.schemaTypes.push(type.name)
        ctx.interfaces.push(type.name)
        ctx.code[type.name] = generateObject(
          type,
          type.fields || [],
          options.skipWrappingEnum
        )
      } else if (type.kind === 'INPUT_OBJECT') {
        ctx.schemaTypes.push(type.name)
        ctx.inputObjects.push(type.name)
        ctx.code[type.name] = generateObject(
          type,
          type.inputFields || [],
          options.skipWrappingEnum
        )
      } else if (type.kind === 'ENUM') {
        ctx.schemaTypes.push(type.name)
        ctx.enums.push(type.name)
        ctx.code[type.name] = generateEnum(type)
      } else if (type.kind === 'SCALAR') {
        if (type.name !== 'Boolean' && type.name !== 'String') {
          const scalar = generateScalar(type, scalarTypes)

          ctx.schemaTypes.push(type.name)
          ctx.scalars.push(type.name)
          ctx.code[type.name] = scalar.code

          if (!scalar.mapped) {
            ctx.unmappedScalars.push(scalar.name)
          }
        }
      } else if (type.kind === 'UNION') {
        ctx.schemaTypes.push(type.name)
        ctx.unions.push(type.name)
        ctx.code[type.name] = generateUnion(type)
      }
    }
  })

  generateArgsAndFields(ctx)
  generateFactory(ctx)

  return { code: generateCode(ctx), ctx }
}
