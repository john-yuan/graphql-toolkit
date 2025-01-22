/* This file was automatically generated and should not be edited. */

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

/**
 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
 */
export type String = string

export type Media = Book | Movie

export interface Book extends Node {
  id: ID
  name: string
  author: string
}

/**
 * The friends reply.
 */
export interface FriendsReply {
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
  total: Int
  data: Media[]
}

export interface Movie extends Node {
  id: ID
  name: string
  duration: Int
}

/**
 * The Node interface.
 */
export interface Node {
  id: ID
}

/**
 * The Order type.
 */
export interface Order extends Node {
  id: ID
  createdAt: Date
}

/**
 * The orders reply.
 */
export interface OrdersReply {
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
}

/**
 * The User type.
 */
export interface User extends Node {
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

/**
 * The order filter.
 */
export interface OrderFilterInput {
  createdAtGTE?: Date | null
  createdAtLTE?: Date | null
}

export type $<T> = T | T[]

export interface $Directive {
  name: string
  args?: any
}

export interface $Directives {
  $directive?: string | $Directive
  $directives?: $<string | $Directive>
}

export interface $GraphQLError {
  message: string
  locations?: { line: number; column: number }[]
  path?: (string | number)[]
  extensions?: Record<string, any>
}

export type $Operation<Fields> = Fields & {
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

export interface QueryNodeArgs {
  id: ID
}

export interface QueryNodesArgs {
  ids: ID[]
}

export interface UserFriendsArgs {
  /**
   * Default value: `1`
   */
  page?: Int | null
  /**
   * Default value: `10`
   */
  size?: Int | null
}

export interface UserMediaArgs {
  /**
   * Default value: `1`
   */
  page?: Int | null
  /**
   * Default value: `10`
   */
  size?: Int | null
  keyword?: string | null
}

export interface UserOrdersArgs {
  /**
   * Default value: `1`
   */
  page?: Int | null
  /**
   * Default value: `10`
   */
  size?: Int | null
  /**
   * Specify the order filter.
   */
  filter?: OrderFilterInput | null
}

export interface MediaPossibleTypes {
  $on?: {
    Book?: BookFields & $Directives
    Movie?: MovieFields & $Directives
  }
}

export interface NodePossibleTypes {
  $on?: {
    User?: UserFields & $Directives
    Order?: OrderFields & $Directives
    Book?: BookFields & $Directives
    Movie?: MovieFields & $Directives
  }
}

export interface BookFields {
  __typename?: $Pick
  id?: $Pick
  name?: $Pick
  author?: $Pick
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
  data?: $<$Options & MediaPossibleTypes>
}

export interface MovieFields {
  __typename?: $Pick
  id?: $Pick
  name?: $Pick
  duration?: $Pick
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
  node?: $<NodeFields & $Options & { $args: QueryNodeArgs } & NodePossibleTypes>
  /**
   * Lookup nodes by a list of IDs.
   */
  nodes?: $<NodeFields & $Options & { $args: QueryNodesArgs } & NodePossibleTypes>
}

export interface UserFields {
  __typename?: $Pick
  id?: $Pick
  name?: $Pick
  /**
   * Query user friends.
   */
  friends?: $<FriendsReplyFields & $Options & { $args?: UserFriendsArgs }>
  /**
   * Query user orders.
   */
  orders?: $<OrdersReplyFields & $Options & { $args?: UserOrdersArgs }>
  /**
   * Query user media.
   */
  media?: $<MediaReplyFields & $Options & { $args?: UserMediaArgs }>
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
  return {
    query: <T = Query, E = GraphQLError>(payload: $Operation<QueryFields>, options?: Options): Promise<{ data?: T | null, errors?: E[] }> => request(Q, null, payload, options),
    queries: {
      /**
       * Query the current logged-in user.
       */
      user: <T = User>(payload: UserFields & $Options, options?: Options): Promise<T> => request(Q, 'user', payload, options),
      /**
       * Fetches an object given its ID.
       */
      node: <T = Node | null>(payload: NodeFields & $Options & { $args: QueryNodeArgs } & NodePossibleTypes, options?: Options): Promise<T> => request(Q, 'node', payload, options),
      /**
       * Lookup nodes by a list of IDs.
       */
      nodes: <T = (Node | null)[]>(payload: NodeFields & $Options & { $args: QueryNodesArgs } & NodePossibleTypes, options?: Options): Promise<T> => request(Q, 'nodes', payload, options)
    }
  }
}
