/* eslint-disable */
/* This file was automatically generated and should not be edited. */

/**
 * The GraphQL operation.
 */
export type GraphqlOperation = {
  query?: $Operation<QueryFields>
  mutation?: $Operation<MutationFields>
}

/**
 * The date string is ISO format.
 */
export type Date = string

/**
 * The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
 */
export type ID = string

/**
 * The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
 */
export type Int = number

export type Media = Book | Movie

export interface Book extends Node {
  __typename?: string
  id: ID
  name: string
  author: string
}

export interface Country {
  __typename?: string
  code: string
  name: string
}

/**
 * The friends reply.
 */
export interface FriendsReply {
  __typename?: string
  /**
   * Total count.
   */
  total: Int
  /**
   * The data for the current page.
   */
  data: User[]
}

export interface MediaReply {
  __typename?: string
  total: Int
  data: Media[]
}

export interface Movie extends Node {
  __typename?: string
  id: ID
  name: string
  duration: Int
}

export interface Mutation {
  __typename?: string
  createBook: Book
}

/**
 * The Node interface.
 */
export interface Node {
  __typename?: string
  id: ID
}

/**
 * The Order type.
 */
export interface Order extends Node {
  __typename?: string
  id: ID
  createdAt: Date
}

/**
 * The orders reply.
 */
export interface OrdersReply {
  __typename?: string
  /**
   * Total count.
   */
  total: Int
  /**
   * The data for the current page.
   */
  data: Order[]
}

/**
 * The root query.
 */
export interface Query {
  __typename?: string
  /**
   * Query the current logged-in user.
   */
  user: User
  /**
   * Fetches an object given its ID.
   */
  node?: Node | null
  /**
   * Lookup nodes by a list of IDs.
   */
  nodes: (Node | null)[]
  country?: Country | null
  countries: Country[]
}

/**
 * The User type.
 */
export interface User extends Node {
  __typename?: string
  id: ID
  name: string
  /**
   * Query user friends.
   */
  friends: FriendsReply
  /**
   * Query user orders.
   */
  orders: OrdersReply
  /**
   * Query user media.
   */
  media?: MediaReply | null
}

export interface CountryFilterInput {
  /**
   * This field is a generated field that can be used to keep an empty input object.
   */
  $keep?: boolean | number
  code?: StringQueryOperatorInput | $Var | null
  continent?: StringQueryOperatorInput | $Var | null
  currency?: StringQueryOperatorInput | $Var | null
  name?: StringQueryOperatorInput | $Var | null
}

export interface CreateBookAuthorInput {
  /**
   * This field is a generated field that can be used to keep an empty input object.
   */
  $keep?: boolean | number
  name?: string | $Var | null
}

export interface CreateBookInput {
  /**
   * This field is a generated field that can be used to keep an empty input object.
   */
  $keep?: boolean | number
  /**
   * Default value: `"Untitled"`
   */
  name?: string | $Var
  author: CreateBookAuthorInput | $Var
}

/**
 * The order filter.
 */
export interface OrderFilterInput {
  /**
   * This field is a generated field that can be used to keep an empty input object.
   */
  $keep?: boolean | number
  createdAtGTE?: Date | $Var | null
  createdAtLTE?: Date | $Var | null
}

export interface StringQueryOperatorInput {
  /**
   * This field is a generated field that can be used to keep an empty input object.
   */
  $keep?: boolean | number
  eq?: string | $Var | null
  in?: (string | $Var)[] | $Var | null
  ne?: string | $Var | null
  nin?: (string | $Var)[] | $Var | null
  regex?: string | $Var | null
}

export type $<T> = T | T[]

export interface $Directive {
  name: string
  args?: any
}

export interface $Directives {
  $directives?: $<string | $Directive>
}

export interface $GraphQLError {
  message: string
  locations?: { line: number; column: number }[]
  path?: (string | number)[]
  extensions?: Record<string, any>
}

export type $Operation<Fields> = Fields & $Directives & {
  __typename?: $Pick
  $name?: string
  $variables?: Record<string, string>
  $fields?: Fields[]
}

export type $Options = $Directives & {
  $alias?: string
}

export type $Pick = $Scalar | $<$Options>

export type $Scalar = string | number | boolean | null | undefined

export type $Var = {
  /** The variable name. For example `$my_variable`. */
  $var: string
}

export interface MutationCreateBookArgs {
  input: CreateBookInput | $Var
}

export interface QueryCountriesArgs {
  /**
   * Default value: `{}`
   */
  filter?: CountryFilterInput | $Var | null
}

export interface QueryCountryArgs {
  code: ID | $Var
}

export interface QueryNodeArgs {
  id: ID | $Var
}

export interface QueryNodesArgs {
  ids: (ID | $Var)[] | $Var
}

export interface UserFriendsArgs {
  /**
   * Default value: `1`
   */
  page?: Int | $Var | null
  /**
   * Default value: `10`
   */
  size?: Int | $Var | null
}

export interface UserMediaArgs {
  /**
   * Default value: `1`
   */
  page?: Int | $Var | null
  /**
   * Default value: `10`
   */
  size?: Int | $Var | null
  keyword?: string | $Var | null
}

export interface UserOrdersArgs {
  /**
   * Default value: `1`
   */
  page?: Int | $Var | null
  /**
   * Default value: `10`
   */
  size?: Int | $Var | null
  /**
   * Specify the order filter.
   */
  filter?: OrderFilterInput | $Var | null
}

export interface MediaPossibleTypes {
  __typename?: $Pick
  $on?: {
    Book?: $<BookFields & $Directives>
    Movie?: $<MovieFields & $Directives>
  }
}

export interface NodePossibleTypes {
  __typename?: $Pick
  $on?: {
    User?: $<UserFields & $Directives>
    Order?: $<OrderFields & $Directives>
    Book?: $<BookFields & $Directives>
    Movie?: $<MovieFields & $Directives>
  }
}

export interface BookFields {
  __typename?: $Pick
  id?: $Pick
  name?: $Pick
  author?: $Pick
}

export interface CountryFields {
  __typename?: $Pick
  code?: $Pick
  name?: $Pick
}

export interface FriendsReplyFields {
  __typename?: $Pick
  /**
   * Total count.
   */
  total?: $Pick
  /**
   * The data for the current page.
   */
  data?: $<UserFields & $Options>
}

export interface MediaReplyFields {
  __typename?: $Pick
  total?: $Pick
  data?: $<MediaPossibleTypes & $Options>
}

export interface MovieFields {
  __typename?: $Pick
  id?: $Pick
  name?: $Pick
  duration?: $Pick
}

export interface MutationFields {
  __typename?: $Pick
  createBook?: $<BookFields & { $args: MutationCreateBookArgs } & $Options>
}

export interface NodeFields {
  __typename?: $Pick
  id?: $Pick
}

export interface OrderFields {
  __typename?: $Pick
  id?: $Pick
  createdAt?: $Pick
}

export interface OrdersReplyFields {
  __typename?: $Pick
  /**
   * Total count.
   */
  total?: $Pick
  /**
   * The data for the current page.
   */
  data?: $<OrderFields & $Options>
}

export interface QueryFields {
  __typename?: $Pick
  /**
   * Query the current logged-in user.
   */
  user?: $<UserFields & $Options>
  /**
   * Fetches an object given its ID.
   */
  node?: $<NodeFields & { $args: QueryNodeArgs } & NodePossibleTypes & $Options>
  /**
   * Lookup nodes by a list of IDs.
   */
  nodes?: $<NodeFields & { $args: QueryNodesArgs } & NodePossibleTypes & $Options>
  country?: $<CountryFields & { $args: QueryCountryArgs } & $Options>
  countries?: $<CountryFields & { $args?: QueryCountriesArgs } & $Options>
}

export interface UserFields {
  __typename?: $Pick
  id?: $Pick
  name?: $Pick
  /**
   * Query user friends.
   */
  friends?: $<FriendsReplyFields & { $args?: UserFriendsArgs } & $Options>
  /**
   * Query user orders.
   */
  orders?: $<OrdersReplyFields & { $args?: UserOrdersArgs } & $Options>
  /**
   * Query user media.
   */
  media?: $<MediaReplyFields & { $args?: UserMediaArgs } & $Options>
}

export default function createGraphQLClient<Options = any, GraphQLError = $GraphQLError>(
  request: (
    /**
     * Operation type.
     */
    type: 'query' | 'mutation',

    /**
     * The operations name.
     *
     * If `name` is `null`, means that the caller is `query()` or
     * `mutation()`. If `name` is a string, means that the caller
     * is `queries.xxx()` or `mutations.xxx()`.
     */
    name: string | null,

    /**
     * The request payload.
     *
     * If `name` is `null`, `payload` is the first parameter of
     * `query()` or `mutation()`. If `name` is a string, `payload`
     * is the first parameter of `queries.xxx()` or `mutations.xxx()`.
     */
    payload: any,

    /**
     * Custom options. The second parameter of the client methods.
     */
    options?: Options
  ) => Promise<any>
) {
  const Q = 'query' as const
  const M = 'mutation' as const
  const attach = (operation: 'query' | 'mutation', methods: string) => {
    const operations = {} as any
    methods.split('/').forEach((key) => {
      operations[key] = (payload: any, options?: any) => request(operation, key, payload, options)
    })
    return operations
  }
  const queries = attach(Q, 'user/node/nodes/country/countries')
  const mutations = attach(M, 'createBook')
  return {
    query: <T = Query, E = GraphQLError>(payload: $Operation<QueryFields>, options?: Options): Promise<{ data?: T | null, errors?: E[] }> => request(Q, null, payload, options),
    mutation: <T = Mutation, E = GraphQLError>(payload: $Operation<MutationFields>, options?: Options): Promise<{ data?: T | null, errors?: E[] }> => request(M, null, payload, options),
    queries: queries as {
      /**
       * Query the current logged-in user.
       */
      user: <T = User>(payload: UserFields & $Options, options?: Options) => Promise<T>
      /**
       * Fetches an object given its ID.
       */
      node: <T = Node | null>(payload: NodeFields & { $args: QueryNodeArgs } & NodePossibleTypes & $Options, options?: Options) => Promise<T>
      /**
       * Lookup nodes by a list of IDs.
       */
      nodes: <T = (Node | null)[]>(payload: NodeFields & { $args: QueryNodesArgs } & NodePossibleTypes & $Options, options?: Options) => Promise<T>
      country: <T = Country | null>(payload: CountryFields & { $args: QueryCountryArgs } & $Options, options?: Options) => Promise<T>
      countries: <T = Country[]>(payload: CountryFields & { $args?: QueryCountriesArgs } & $Options, options?: Options) => Promise<T>
    },
    mutations: mutations as {
      createBook: <T = Book>(payload: BookFields & { $args: MutationCreateBookArgs } & $Options, options?: Options) => Promise<T>
    }
  }
}
