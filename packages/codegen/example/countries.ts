/* This file was automatically generated and should not be edited. */
/* eslint-disable */
/* tslint:disable */

/**
 * Scalar type: `Boolean`.
 *
 * The `Boolean` scalar type represents `true` or `false`.
 */
export type Boolean = boolean

export interface Continent {
  __typename?: string
  code: ID
  countries: Country[]
  name: String
}

export interface ContinentFilterInput {
  code?: StringQueryOperatorInput | null
}

export interface Country {
  __typename?: string
  awsRegion: String
  capital?: String
  code: ID
  continent: Continent
  currencies: String[]
  currency?: String
  emoji: String
  emojiU: String
  languages: Language[]
  name: String
  native: String
  phone: String
  phones: String[]
  states: State[]
  subdivisions: Subdivision[]
}

export interface CountryFilterInput {
  code?: StringQueryOperatorInput | null
  continent?: StringQueryOperatorInput | null
  currency?: StringQueryOperatorInput | null
}

/**
 * Scalar type: `Float`.
 *
 * The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).
 */
export type Float = number

/**
 * Scalar type: `ID`.
 *
 * The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
 */
export type ID = string

/**
 * Scalar type: `Int`.
 *
 * The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
 */
export type Int = number

export interface Language {
  __typename?: string
  code: ID
  name: String
  native: String
  rtl: Boolean
}

export interface LanguageFilterInput {
  code?: StringQueryOperatorInput | null
}

export interface Query {
  __typename?: string
  continent?: Continent
  continents: Continent[]
  countries: Country[]
  country?: Country
  language?: Language
  languages: Language[]
}

export interface State {
  __typename?: string
  code?: String
  country: Country
  name: String
}

/**
 * Scalar type: `String`.
 *
 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
 */
export type String = string

export interface StringQueryOperatorInput {
  eq?: String | null
  in?: String[] | null
  ne?: String | null
  nin?: String[] | null
  regex?: String | null
}

export interface Subdivision {
  __typename?: string
  code: ID
  emoji?: String
  name: String
}

/**
 * A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.
 *
 * In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.
 */
export interface __Directive {
  __typename?: string
  name: String
  description?: String
  isRepeatable: Boolean
  locations: __DirectiveLocation[]
  args: __InputValue[]
}

/**
 * A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.
 *
 * - `QUERY` Location adjacent to a query operation.
 * - `MUTATION` Location adjacent to a mutation operation.
 * - `SUBSCRIPTION` Location adjacent to a subscription operation.
 * - `FIELD` Location adjacent to a field.
 * - `FRAGMENT_DEFINITION` Location adjacent to a fragment definition.
 * - `FRAGMENT_SPREAD` Location adjacent to a fragment spread.
 * - `INLINE_FRAGMENT` Location adjacent to an inline fragment.
 * - `VARIABLE_DEFINITION` Location adjacent to a variable definition.
 * - `SCHEMA` Location adjacent to a schema definition.
 * - `SCALAR` Location adjacent to a scalar definition.
 * - `OBJECT` Location adjacent to an object type definition.
 * - `FIELD_DEFINITION` Location adjacent to a field definition.
 * - `ARGUMENT_DEFINITION` Location adjacent to an argument definition.
 * - `INTERFACE` Location adjacent to an interface definition.
 * - `UNION` Location adjacent to a union definition.
 * - `ENUM` Location adjacent to an enum definition.
 * - `ENUM_VALUE` Location adjacent to an enum value definition.
 * - `INPUT_OBJECT` Location adjacent to an input object type definition.
 * - `INPUT_FIELD_DEFINITION` Location adjacent to an input object field definition.
 */
export type __DirectiveLocation =
  | "QUERY"
  | "MUTATION"
  | "SUBSCRIPTION"
  | "FIELD"
  | "FRAGMENT_DEFINITION"
  | "FRAGMENT_SPREAD"
  | "INLINE_FRAGMENT"
  | "VARIABLE_DEFINITION"
  | "SCHEMA"
  | "SCALAR"
  | "OBJECT"
  | "FIELD_DEFINITION"
  | "ARGUMENT_DEFINITION"
  | "INTERFACE"
  | "UNION"
  | "ENUM"
  | "ENUM_VALUE"
  | "INPUT_OBJECT"
  | "INPUT_FIELD_DEFINITION"

/**
 * One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.
 */
export interface __EnumValue {
  __typename?: string
  name: String
  description?: String
  isDeprecated: Boolean
  deprecationReason?: String
}

/**
 * Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.
 */
export interface __Field {
  __typename?: string
  name: String
  description?: String
  args: __InputValue[]
  type: __Type
  isDeprecated: Boolean
  deprecationReason?: String
}

/**
 * Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.
 */
export interface __InputValue {
  __typename?: string
  name: String
  description?: String
  type: __Type
  /**
   * A GraphQL-formatted string representing the default value for this input value.
   */
  defaultValue?: String
  isDeprecated: Boolean
  deprecationReason?: String
}

/**
 * A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.
 */
export interface __Schema {
  __typename?: string
  description?: String
  /**
   * A list of all types supported by this server.
   */
  types: __Type[]
  /**
   * The type that query operations will be rooted at.
   */
  queryType: __Type
  /**
   * If this server supports mutation, the type that mutation operations will be rooted at.
   */
  mutationType?: __Type
  /**
   * If this server support subscription, the type that subscription operations will be rooted at.
   */
  subscriptionType?: __Type
  /**
   * A list of all directives supported by this server.
   */
  directives: __Directive[]
}

/**
 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.
 *
 * Depending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.
 */
export interface __Type {
  __typename?: string
  kind: __TypeKind
  name?: String
  description?: String
  specifiedByURL?: String
  fields?: __Field[]
  interfaces?: __Type[]
  possibleTypes?: __Type[]
  enumValues?: __EnumValue[]
  inputFields?: __InputValue[]
  ofType?: __Type
}

/**
 * An enum describing what kind of type a given `__Type` is.
 *
 * - `SCALAR` Indicates this type is a scalar.
 * - `OBJECT` Indicates this type is an object. `fields` and `interfaces` are valid fields.
 * - `INTERFACE` Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields.
 * - `UNION` Indicates this type is a union. `possibleTypes` is a valid field.
 * - `ENUM` Indicates this type is an enum. `enumValues` is a valid field.
 * - `INPUT_OBJECT` Indicates this type is an input object. `inputFields` is a valid field.
 * - `LIST` Indicates this type is a list. `ofType` is a valid field.
 * - `NON_NULL` Indicates this type is a non-null. `ofType` is a valid field.
 */
export type __TypeKind =
  | "SCALAR"
  | "OBJECT"
  | "INTERFACE"
  | "UNION"
  | "ENUM"
  | "INPUT_OBJECT"
  | "LIST"
  | "NON_NULL"

export interface CountryNameArgs {
  lang?: String | null
}

export interface QueryContinentArgs {
  code: ID
}

export interface QueryContinentsArgs {
  /**
   * Default value: `{}`
   */
  filter?: ContinentFilterInput | null
}

export interface QueryCountriesArgs {
  /**
   * Default value: `{}`
   */
  filter?: CountryFilterInput | null
}

export interface QueryCountryArgs {
  code: ID
}

export interface QueryLanguageArgs {
  code: ID
}

export interface QueryLanguagesArgs {
  /**
   * Default value: `{}`
   */
  filter?: LanguageFilterInput | null
}
export type $List<T> = T | T[]
export type $Object<T> = T | T[]

export interface $Directive {
  name: string
  args?: any
}

export type $Directives = $List<string | $Directive>

export interface $FragmentSpread {
  spread: string
  directives?: $Directives
}

export interface $InlineFragment {
  $on?: string
  $directives?: $Directives
  $fragments?: $Fragment[]

  [key: string]: $Primitive<any> | $AnyFields | $AnyFields[] | object
}

export type $Fragment = $FragmentSpread | { inline: $InlineFragment }

export interface $PrimitiveOptions<Args = void> {
  $alias?: string
  $args?: Args
  $directives?: $Directives
}

export type $Primitive<Args = void> =
  | boolean
  | null
  | number
  | string
  | undefined
  | $PrimitiveOptions<Args>
  | $PrimitiveOptions<Args>[]

export interface $Fields<Args = void> {
  __typename?: $Primitive
  $alias?: string
  $args?: Args
  $directives?: $Directives
  $fragments?: $Fragment[]
}

export interface $AnyFields extends $Fields<any> {
  [key: string]: $Primitive<any> | $AnyFields | $AnyFields[] | object
}

export type $Operation<Fields> = Fields & {
  __typename?: $Primitive
  $name?: string
  $variables?: Record<string, string>
  $directives?: $Directives
  $fragments?: $Fragment[]
  $fields?: (Fields & { $fragments?: $Fragment[] })[]
}

export interface $GraphQLError {
  message: string
  locations?: { line: number; column: number }[]
  path?: (string | number)[]
  extensions?: Record<string, any>
}

export interface LanguageFields<Args = void> extends $Fields<Args> {
  code?: $Primitive
  name?: $Primitive
  native?: $Primitive
  rtl?: $Primitive
}

export interface StateFields<Args = void> extends $Fields<Args> {
  code?: $Primitive
  country?: $Object<CountryFields>
  name?: $Primitive
}

export interface SubdivisionFields<Args = void> extends $Fields<Args> {
  code?: $Primitive
  emoji?: $Primitive
  name?: $Primitive
}

export interface CountryFields<Args = void> extends $Fields<Args> {
  awsRegion?: $Primitive
  capital?: $Primitive
  code?: $Primitive
  continent?: $Object<ContinentFields>
  currencies?: $Primitive
  currency?: $Primitive
  emoji?: $Primitive
  emojiU?: $Primitive
  languages?: $Object<LanguageFields>
  name?: $Primitive<CountryNameArgs>
  native?: $Primitive
  phone?: $Primitive
  phones?: $Primitive
  states?: $Object<StateFields>
  subdivisions?: $Object<SubdivisionFields>
}

export interface ContinentFields<Args = void> extends $Fields<Args> {
  code?: $Primitive
  countries?: $Object<CountryFields>
  name?: $Primitive
}

export interface QueryFields {
  continent?: $Object<ContinentFields<QueryContinentArgs>>
  continents?: $Object<ContinentFields<QueryContinentsArgs>>
  countries?: $Object<CountryFields<QueryCountriesArgs>>
  country?: $Object<CountryFields<QueryCountryArgs>>
  language?: $Object<LanguageFields<QueryLanguageArgs>>
  languages?: $Object<LanguageFields<QueryLanguagesArgs>>
}

export type QueryOperation = $Operation<QueryFields>

export default function createGraphQLClient<Options = any, GraphQLError = $GraphQLError>(
  request: (
    /**
     * Operation type.
     */
    type: 'query' | 'mutation',

    /**
     * - If `name` is `null`, means that the caller is `query()` or `mutation()`.
     * - If `name` is a string, means that the caller is `queries.xxx()` or `mutations.xxx()`.
     */
    name: string | null,

    /**
     * - If `name` is `null`, `payload` is the first parameter of `query()` or `mutation()`.
     * - If `name` is a string, `payload` is the first parameter of `queries.xxx()` or `mutations.xxx()`.
     */
    payload: any,

    /**
     * Custom options.
     */
    options?: Options
  ) => Promise<any>
) {
  const Q: 'query' = 'query'
  return {
    query: <T = Query, E = GraphQLError>(operation: QueryOperation, options?: Options): Promise<{ data?: T | null, errors?: E[] }> => request(Q, null, operation, options),
    queries: {
      continent: <T = Continent>(fields: ContinentFields<QueryContinentArgs>, options?: Options): Promise<T> => request(Q, 'continent', fields, options),
      continents: <T = Continent[]>(fields: ContinentFields<QueryContinentsArgs>, options?: Options): Promise<T> => request(Q, 'continents', fields, options),
      countries: <T = Country[]>(fields: CountryFields<QueryCountriesArgs>, options?: Options): Promise<T> => request(Q, 'countries', fields, options),
      country: <T = Country>(fields: CountryFields<QueryCountryArgs>, options?: Options): Promise<T> => request(Q, 'country', fields, options),
      language: <T = Language>(fields: LanguageFields<QueryLanguageArgs>, options?: Options): Promise<T> => request(Q, 'language', fields, options),
      languages: <T = Language[]>(fields: LanguageFields<QueryLanguagesArgs>, options?: Options): Promise<T> => request(Q, 'languages', fields, options)
    }
  }
}
