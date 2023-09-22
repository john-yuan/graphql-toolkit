# README

[![npm version](https://img.shields.io/npm/v/@mygql/codegen.svg)](https://www.npmjs.com/package/@mygql/codegen)
[![install size](https://packagephobia.now.sh/badge?p=@mygql/codegen)](https://packagephobia.now.sh/result?p=@mygql/codegen)

<!-- [![npm downloads](https://img.shields.io/npm/dm/@mygql/codegen.svg)](http://npm-stat.com/charts.html?package=@mygql/codegen) -->

```bash
npm i @mygql/codegen --save-dev
```

Generate TypeScript code from GraphQL introspection.

This module will do the following things for you:

- Generate TypeScript code for all types found in your GraphQL introspection.
- Generate a factory function which you can use to create your GraphQL client.

> When creating your GraphQL client, you should use the [`@mygql/graphql`](https://www.npmjs.com/package/@mygql/graphql) package to convert the parameters to GraphQL query.

To get started, you can [checkout the example directory][example] or [take a look at the generated file][generated]. You can also [click here to try MyGQL online](https://mygqljs.github.io/#codegen).

[example]: https://github.com/john-yuan/MyGQL/tree/main/packages/codegen/example/README.md
[generated]: https://github.com/john-yuan/MyGQL/blob/main/packages/codegen/example/countries.ts

Table of contents:

- [Usage](#usage)
- [Configuration file format](#configuration-file-format)
- [How to get GraphQL introspection?](#how-to-get-graphql-introspection)

## Usage

With command:

```bash
npx @mygql/codegen --config ./config.json
```

An example of configuration file:

```json
{
  "files": [
    {
      "filename": "./graphql/example-introspection.json",
      "output": "./generated/example.ts"
    },
    {
      "endpoint": { "url": "https://countries.trevorblades.com/" },
      "output": "./generated/countries.ts"
    }
  ]
}
```

Or you can use the `generate` function programmatically:

```ts
import generate from '@mygql/codegen'

generate({
  files: [
    {
      filename: './graphql/example-introspection.json',
      output: './generated/example.ts'
    },
    {
      endpoint: { url: 'https://countries.trevorblades.com/' },
      output: './generated/countries.ts'
    }
  ]
})
```

## Configuration file format

````ts
export interface ConfigurationFile {
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
   * The output path of the generated typescript file.
   * The path is relative the configuration file.
   */
  output: string

  /**
   * The filename of the schema introspection json file.
   * The path is relative the configuration file.
   */
  filename?: string

  /**
   * The endpoint to fetch the schema. If `filename` is defined,
   * `endpoint` will be ignored.
   */
  endpoint?: {
    /**
     * The url to fetch schema.
     */
    url: string

    /**
     * The headers to add when requesting schema.
     */
    headers?: Record<string, any>

    /**
     * Path to a json file. The json value will be used as `headers`.
     * The path is relative the configuration file.
     */
    headersFile?: string
  }

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

export interface Options {
  /**
   * Specify scalar types mapping. This mapping is used to map GraphQL scalar
   * types to TypeScript types. The default mapping is:
   *
   * ```json
   * {
   *    "Int": "number",
   *    "Float": "number",
   *    "String": "string",
   *    "Boolean": "boolean",
   *    "ID": "string"
   * }
   * ```
   *
   * Please note that `String` will be replaced by `string` and `Boolean` will
   * be replaced by `boolean` directly (no type alias will be generated).
   *
   * If the a scalar type is not specified, it will be mapped to `unknown`.
   */
  scalarTypes?: Record<string, string> | [string, string][]

  /**
   * Skip generating the generated tip.
   */
  skipGeneratedTip?: boolean

  /**
   * Skip generating comments for disabling lint.
   */
  skipLintComments?: boolean

  /**
   * Skip wrapping enum in the args as `{ $enum: EnumType }`.
   */
  skipWrappingArgsEnum?: boolean

  /**
   * Skip generating `xxxArgs` types. If this option is `true`, the
   * `xxxFields` and the factory function will not be generated too.
   */
  skipArgs?: boolean

  /**
   * Skip generating `xxxFields` types. If this option is
   * `true`, the factory function will not be generated too.
   */
  skipFields?: boolean

  /**
   * Skip generating factory function.
   */
  skipFactory?: boolean

  /**
   * Skip generating `query` method.
   */
  skipQuery?: boolean

  /**
   * Skip generating `queries` object.
   */
  skipQueries?: boolean

  /**
   * Skip generating `mutation` method.
   */
  skipMutation?: boolean

  /**
   * Skip generating `mutations` object.
   */
  skipMutations?: boolean

  /**
   * The file headers.
   */
  headers?: string[]

  /**
   * The file footers.
   */
  footers?: string[]
}
````

## How to get GraphQL introspection?

You can use the following GraphQL query to query the introspection:

```gql
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
  }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
```
