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
