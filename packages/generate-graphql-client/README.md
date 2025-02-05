# README

[![npm version](https://img.shields.io/npm/v/generate-graphql-client.svg)](https://www.npmjs.com/package/generate-graphql-client)

<!-- [![npm downloads](https://img.shields.io/npm/dm/generate-graphql-client.svg)](http://npm-stat.com/charts.html?package=generate-graphql-client) -->

```bash
npm i generate-graphql-client --save-dev
```

This package is designed to generate TypeScript code from the GraphQL schema.

Starting from the root query and mutation, this tool generates TypeScript code for every type it finds. Moreover, it will generate several useful types for GraphQL query validation and a factory function to create a type-safe GraphQL client. Below is an example usage of the generated client.

```ts
import { client } from './client'

client.queries
  .user({
    $args: { id: '1001' },
    id: true,
    name: true,
    avatar: true
  })
  .then((user) => {
    // The type of user is `User | null`.
    console.log(user)
  })
```

In the above TypeScript code, we send a GraphQL query to the server. Both the argument and return type of the `client.queries.user` method are typed. The code sends the following GraphQL query to the server.

```gql
query {
  user(id: "1001") {
    id
    name
    avatar
  }
}
```

Table of contents:

- [Get started](#get-started)
- [Add authorization headers to the endpoints](#add-authorization-headers-to-the-endpoints)
- [Generate code directly from the GraphQL schema](#generate-code-directly-from-the-graphql-schema)
- [Examples](#examples)
  - [Basic usage](#basic-usage)
  - [Query interface](#query-interface)
  - [Use enum in arguments](#use-enum-in-arguments)
  - [Use directives](#use-directives)
- [Configuration](#configuration)

## Get started

Before we start, please make sure the dependencies have been installed.

```sh
npm i generate-graphql-query
npm i generate-graphql-client --save-dev
```

Then create a script and save it to `<root>/scripts/graphql.mjs` with the following content.

```js
import { generate } from 'generate-graphql-client'

generate({
  files: [
    {
      endpoint: 'https://www.example.com/graphql',
      output: 'src/graphql/types.ts'
    }
  ]
})
```

> [!NOTE]
> In the example above, we generate code from the endpoint. However, for security reasons, some endpoints require authentication to query the schema. In such cases, you can [configure authorization headers](#add-authorization-headers-to-the-endpoints). If an endpoint doesn’t expose an API for schema queries, you can [generate code directly from the GraphQL schema](#generate-code-directly-from-the-graphql-schema).

Now we can run the script to generate the TypeScript code.

```sh
# Make sure we are in the <root> directory
node ./scripts/graphql.mjs
```

> [!NOTE]
> You can also use the `generate-graphql-client` command to generate TypeScript code. To do that, just serialize the parameter we passed to the `generate` function with JSON format and save it to a file. Then run the following command to generate the code.
>
> ```sh
> npx generate-graphql-client --config path/to/config.json
> ```
>
> Please note that the relative paths in the JSON config is relative to the JSON file.

The generated code will be saved to `src/graphql/types.ts`. It contains all the types we found and exports a factory function that we can used to create GraphQL client as its default export.

In the following code, we will create a GraphQL client based on the generated file. Create a file named `<root>/graphql/client.ts` with the following content.

```ts
// We will use generate-graphql-query to generate the query.
import { generateQuery } from 'generate-graphql-query'

// Import the generated factory function.
import createGraphQLClient from './types'

/**
 * Example of custom options. You can change this type to whatever you want.
 */
export interface Options {
  cache?: 'cache-only' | 'network-only'
}

/**
 * Define a function to send GraphQL query.
 * In this example we will use the Fetch API.
 * You can use whatever you want, maybe axios for example.
 * You can also add authorization headers here if needed.
 */
const sendQuery = async (query: string, options?: Options) => {
  // Handle the options.
  console.log(options)

  return fetch('https://www.example.com/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  }).then((res) => res.json())
}

/**
 * Create the GraphQL client with the generated factory function.
 * The factory function accepts a async function as its parameter and
 * the async function accepts the following four parameters:
 *
 * - `type`: The operation type (query or mutation).
 * - `name`: The operations name. If `name` is `null`, means that the
 *    caller is `query()` or `mutation()`. If `name` is a string, means
 *    that the caller is `queries.xxx()` or `mutations.xxx()`.
 * - `payload`: If `name` is `null`, `payload` is the first parameter
 *    of `query()` or `mutation()`. If `name` is a string, `payload`
 *    is the first parameter of `queries.xxx()` or `mutations.xxx()`.
 * - `options`: Custom options. The second parameter of the client methods.
 */
export const client = createGraphQLClient<Options>(
  async (type, name, payload, options) => {
    // If name is `null`, means that the caller function is `query()` or
    // `mutation()` and `payload` is the first parameter of `query()` or
    // `mutation()`. In this case, we should return the entire response json.
    if (name === null) {
      return sendQuery(generateQuery({ [type]: payload }), options)
    }

    // If `name` is a string, means that the caller function is `queries.xxx()`
    // or `mutations.xxx()` and `payload` is the first parameter of
    // `queries.xxx()` or `mutations.xxx()`. In this case, we should return
    // the expected data and throw error if something went wrong.
    return sendQuery(
      generateQuery({ [type]: { [name]: payload } }),
      options
    ).then((res) => {
      if (res.errors?.[0]) {
        throw new Error(res.errors[0].message)
      }
      return res.data[name]
    })
  }
)
```

The client has the following properties.

- `query` A function that can be used to send multiple queries.
- `queries` An object containing all query methods the GraphQL API supports.
- `mutation` A function that can be used to send multiple mutations.
- `mutations` An object containing all mutation methods the GraphQL API supports.

> [!CAUTION]
> If the GraphQL API does not provide any queries, `query` and `queries` will not be generated. And if the GraphQL API does not provide any mutations, `mutation` and `mutations` will not be generated.

## Add authorization headers to the endpoints

For security reasons, some endpoints require authentication to query the schema. In such cases, we can add headers through the endpoint config. For example:

```ts
import { generate } from 'generate-graphql-client'

generate({
  files: [
    {
      endpoint: {
        url: 'https://www.example.com/graphql',
        headers: {
          Authorization: 'Bearer ***'
        }
      },
      output: 'src/graphql/types.ts'
    }
  ]
})
```

In the code above, we add authorization headers directly in the script file. While this works as expected, we may not want to commit these headers to our source tree. To prevent this, we can use the `headerFile` config to reference an external JSON file for the authorization headers and add that file to `.gitignore`. For example:

```ts
import { generate } from 'generate-graphql-client'

generate({
  files: [
    {
      endpoint: {
        url: 'https://www.example.com/graphql',
        headersFile: 'src/graphql/headers.json'
      },
      output: 'src/graphql/types.ts'
    }
  ]
})
```

The content of `src/graphql/headers.json` is:

```json
{
  "Authorization": "Bearer ***"
}
```

In the code above, the content of `src/graphql/headers.json` will be used as headers for the endpoint. To prevent this file from being committed to the source tree, you should add it to `.gitignore`.

## Generate code directly from the GraphQL schema

If the endpoint does not allow schema queries or if adding headers to the request is inconvenient. We can generate code from the GraphQL schema files.

First we need to convert the GraphQL schema files to a introspection JSON file.

Install the `generate-graphql-introspection` command:

```sh
npm i generate-graphql-introspection --save-dev
```

Generate the introspection file:

```sh
npx generate-graphql-introspection -s src/graphql/schema.graphql -o src/graphql/introspection.json
```

Generate code from the generated introspection file:

```ts
import { generate } from 'generate-graphql-client'

generate({
  files: [
    {
      filename: 'src/graphql/introspection.json',
      output: 'src/graphql/types.ts'
    }
  ]
})
```

> [!NOTE]
> If your schema is divided into multiple `.graphql` files. You can use a glob to specify the schema path. For example:
>
> ```sh
> npx generate-graphql-introspection -s "src/graphql/*.graphql" -o src/graphql/introspection.json
> ```
>
> You can run `npx generate-graphql-introspection -h` for its docs.

## Examples

This section provides examples demonstrating how to use the generated GraphQL client.

### Basic usage

```ts
client.queries.user({
  $args: { id: '1001' },
  // Select the id field.
  id: true,
  // Instead of using `true` to select field.
  // We can also use `number` to select field for its shorter.
  name: 1,
  avatar: 1
})
```

### Query interface

```ts
import { client } from './client'
import type { Order } from './types'

client.queries
  .node({
    $args: { id: '10002' },
    $on: {
      Order: {
        __typename: true,
        id: true,
        createdAt: true
      }
    }
  })
  .then((node) => {
    // The type of node is `Node | null`.
    if (node && node.__typename === 'Order') {
      const order = node as Order
      console.log(order)
    }
  })
```

The above code sends the following GraphQL query to the server.

```gql
query {
  node(id: "10002") {
    ... on Order {
      __typename
      id
      createdAt
    }
  }
}
```

### Use enum in arguments

Because enum cannot be quoted in GraphQL, we need to use the `$enum` flag to indicate that the argument should be treated as an enum. For example:

```ts
client.queries.todos({
  $args: {
    status: { $enum: 'IN_PROGRESS' }
  },
  id: 1,
  text: 1,
  createdAt: 1
})
```

The above code sends the following GraphQL query to the server.

```gql
query {
  todos(status: IN_PROGRESS) {
    id
    text
    createdAt
  }
}
```

### Use directives

```ts
client.queries.todos({
  id: {
    // Use string to set directive
    $directives: '@skip(if: false)'
  },
  text: {
    // Use object to set directive
    $directives: {
      name: '@skip',
      args: { if: false }
    }
  },
  createdAt: {
    // Use array to set multiple directives
    $directives: [
      '@include(if: true)',
      {
        name: '@skip',
        args: { if: false }
      }
    ]
  }
})
```

The above code sends the following GraphQL query to the server.

```gql
query {
  todos {
    id @skip(if: false)
    text @skip(if: false)
    createdAt @include(if: true) @skip(if: false)
  }
}
```

## Configuration

The configuration type is defined as follows.

````ts
export interface Configuration {
  /**
   * Global options. Default options for every schema files.
   */
  options?: Options

  /**
   * Schema files.
   */
  files?: SchemaFile[]
}

export interface SchemaFile {
  /**
   * The endpoint to fetch the schema introspection json file.
   * If `endpoint` is set, the `filename` option will be ignored.
   */
  endpoint?: string | Endpoint

  /**
   * Specify the file path to the introspection json file.
   * If `endpoint` is set, this option will be ignored.
   *
   * If the configuration is written in a JSON file,
   * the path is relative to that JSON file.
   */
  filename?: string

  /**
   * The output path of the generated typescript file.
   *
   * If the configuration is written in a JSON file,
   * the path is relative to that JSON file.
   */
  output: string

  /**
   * The options of the current schema file. If a option of `options` is
   * not set or set to `null`, the corresponding option in global options
   * will be used.
   */
  options?: Options

  /**
   * By default, `options.scalarTypes` will extend the `scalarTypes`
   * defined in the global options. You can set `skipGlobalScalarTypes`
   * to avoid this.
   */
  skipGlobalScalarTypes?: boolean

  /**
   * Skip this file.
   */
  skip?: boolean
}

export interface Endpoint {
  /**
   * The endpoint url.
   */
  url: string

  /**
   * Specify the request headers.
   */
  headers?: Record<string, any>

  /**
   * Path to a JSON file. The content will be used as `headers`.
   */
  headersFile?: string
}

export interface Options {
  /**
   * Specify the indent. The default value is 2 spaces.
   */
  indent?: string

  /**
   * Specify scalar types mapping. This mapping is used to map GraphQL scalar
   * types to TypeScript types. The default mapping is:
   *
   * ```json
   * {
   *   "ID": "string",
   *   "Int": "number",
   *   "Float": "number"
   * }
   * ```
   *
   * Please note that `String` will be replaced by `string` and `Boolean` will
   * be replaced by `boolean` directly (no type alias will be generated).
   *
   * If the a scalar type is not specified, it will be mapped to `unknown`.
   */
  scalarTypes?: Record<string, string>

  /**
   * Rename the type in the schema to a custom name. For example:
   *
   * ```json
   * {
   *   "Phone": "CellPhone"
   * }
   * ```
   *
   * The above config will rename the type `Phone` to `CellPhone`.
   *
   * Please note that the custom name cannot be used in the schema, and
   * cannot be the built-in names. Otherwise, an error will be thrown.
   *
   * Normally, you will not use this option. This option is designed to
   * fix conflicts. For example, a schema may define a scalar named
   * `BigInt`. The type name `BigInt` conflicts with `window.BigInt`.
   * The lint tool may complain about this. To avoid this, we can use
   * this option to rename `BigInt` to `_BigInt` in the generated code.
   */
  renameTypes?: Record<string, string>

  /**
   * The file headers.
   */
  headers?: string[]

  /**
   * Skip generating the generated message.
   */
  skipGeneratedMessage?: boolean

  /**
   * Skip wrapping enum in the args as `{ $enum: EnumType }`.
   */
  skipWrappingEnum?: boolean

  /**
   * Skip generating factory function.
   */
  skipFactory?: boolean

  /**
   * Skip generating `queries` object.
   */
  skipQueries?: boolean

  /**
   * Skip generating `mutations` object.
   */
  skipMutations?: boolean

  /**
   * By default the `__typename` field in the response objects is an
   * optional string. You can set this option to `true` to make it a
   * required string.
   */
  markTypenameAsRequired?: boolean
}
````
