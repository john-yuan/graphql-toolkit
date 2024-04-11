export interface Introspection {
  data: {
    __schema: Schema
  }
}

export interface Schema {
  description?: string
  types: Type[]
  queryType: Type
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
