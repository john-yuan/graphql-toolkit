export const builtinTypes = `
export type $List<T> = T | T[]

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

  [key: string]: $Field<any> | object
}

export type $Fragment = $FragmentSpread | { inline: $InlineFragment }

export interface $Fields<Args = {}> {
  __typename?: $Field
  $alias?: string
  $args?: Args
  $directives?: $Directives
  $fragments?: $Fragment[]
  $content?: string
  $body?: string
}

export type $Field<Args = {}> =
  | boolean
  | null
  | number
  | string
  | undefined
  | $Fields<Args>
  | $Fields<Args>[]

export type $Operation<Fields> = Fields & {
  __typename?: $Field
  $name?: string
  $variables?: Record<string, string>
  $directives?: $Directives
  $fragments?: $Fragment[]
  $fields?: (Fields & { $fragments?: $Fragment[] })[]
}

export interface $GraphQLError {
  message: string
  locations?: { line: number, column: number }[]
  path?: (string | number)[]
  extensions?: Record<string, any>
}
`.trim()
