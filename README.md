# GraphQL Toolkit

A toolkit for generating GraphQL clients in TypeScript from your GraphQL endpoints.

This repository contains the following two packages:

- [`generate-graphql-client`](./packages/generate-graphql-client/) A command line tool to generate TypeScript code from your GraphQL introspection (via JSON file or endpoint URL). This module should be installed as dev dependency. You can [click here to read the docs](./packages/generate-graphql-client/README.md).
- [`generate-graphql-query`](./packages/generate-graphql-query/) A module to help us generate GraphQL query from JavaScript object. This module has **zero dependencies** and the bundle size of it is small (**under 3kB**). This module should be installed as dependency for your web application. You can [click here to read the docs](./packages/generate-graphql-query/README.md).

With GraphQL Toolkit, we can send requests to our GraphQL endpoint as shown in the following code.

```ts
import client from './client'

client.queries.countries({
  $args: {
    filter: {
      continent: { in: ['AF'] }
    }
  },
  code: true,
  name: true
}).then((countries) => {
  console.log(countries)
})
```

In the above code, the `client` is created by the factory function generated by GraphQL Toolkit. The `client.queries.countries` method and its argument and return value are all typed. The methods and types are generated by GraphQL Toolkit based on the GraphQL endpoint you provided. Finally, the above code will send the following GraphQL query to the server.

```gql
query {
  countries (
    filter: {
      continent: {
        in: ["AF"]
      }
    }
  ) {
    code
    name
  }
}
```

The advantage is that we don't need to build the GraphQL query manually anymore (which is error-prone and not type-checked). TypeScript will tell us what arguments we can use and what fields we can ask from the API. You don't even need to read your GraphQL API docs anymore, because TypeScript will tell you everything.

The generated client has the following properties:

- `query` A function that can be used to send multiple queries.
- `quires` An object containing all query methods the GraphQL API supports.
- `mutation` A function that can be used to send multiple mutations.
- `mutations` An object containing all mutation methods the GraphQL API supports.

> Note: If the GraphQL API does not provide any queries, `query` and `queries` will not be generated. And if the GraphQL API does not provide any mutations, `mutation` and `mutations` will not be generated. [For more details, please read the docs of generate-graphql-client](./packages/generate-graphql-client/README.md).

## Get started

First, install the dependencies.

```bash
npm i generate-graphql-query
npm i generate-graphql-client --save-dev
```

Now create a script file and save it to `<root>/scripts/graphql.mjs` with the following content.

```js
import path from 'node:path'
import { generate } from 'generate-graphql-client'

const ROOT_DIR = path.resolve(import.meta.dirname, '..')

generate({
  files: [
    {
      endpoint: "https://countries.trevorblades.com",
      output: path.resolve(ROOT_DIR, "src/graphql/countries/types.ts")
    }
  ]
})
```

Then we can run the script file to generate the TypeScript code.

```bash
node ./scripts/graphql.mjs
```

The above script will fetch the GraphQL introspection file from the specified endpoint (in our example, the endpoint is [https://countries.trevorblades.com](https://countries.trevorblades.com)), and generate TypeScript code based on its content and save it to `<root>/src/graphql/countries/types.ts`.

GraphQL Toolkit will generate TypeScript code for all the types found in the GraphQL endpoint and a factory function which you can use to create your GraphQL client.

Now we can create our client based on the generated file. Create a new file and save it to `<root>/src/graphql/countries/client.ts` with the following content.

```ts
// We will use generate-graphql-query to generate the query.
import { generateQuery } from 'generate-graphql-query'

// Import the generated factory function.
import createGraphQLClient from './types'

// Define a function to send GraphQL query.
const sendQuery = async (query: string) => {
  // In this example we will use the Fetch API.
  // You can use whatever you want, maybe axios for example.
  // You can also add authorization headers here if needed.
  return fetch('https://countries.trevorblades.com/', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  }).then((res) => res.json())
}

// Create the GraphQL client with the generated factory function.
// The factory function accepts a async function as its parameter.
const client = createGraphQLClient(
  async (
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
    options?: any
  ) => {
    // The `options` parameter is designed to pass some extra options.
    // But in this example, we will not use it.

    // If name is `null`, means that the caller function is `query()` or
    // `mutation()` and `payload` is the first parameter of `query()` or
    // `mutation()`. In this case, we should return the entire response json.
    if (name === null) {
      return sendQuery(generateQuery({ [type]: payload }))
    }

    // If `name` is a string, means that the caller function is `queries.xxx()`
    // or `mutations.xxx()` and `payload` is the first parameter of
    // `queries.xxx()` or `mutations.xxx()`. In this case, we should return
    // the expected data and throw error if something went wrong.
    return sendQuery(generateQuery({ [type]: { [name]: payload } })).then(
      (res) => {
        if (res.errors?.[0]) {
          throw new Error(res.errors[0].message)
        }
        return res.data[name]
      }
    )
  }
)

export default client
```

Now we can use the client somewhere else:

```ts
import client from '@/graphql/countries/client'

// Get country by the code.
client.queries.country({
  $args: { code: 'BR' },
  name: true,
  capital: true,
  currency: true,
  languages: { code: true, name: true }
}).then((country) => {
  console.log(country)
})
```

Below is a more complicated example. This example demonstrates the following features:

- Dynamic arguments.
- Passing Arguments to sub-fields.
- Using alias.
- Using directives.

```ts
import client from '@/graphql/countries/client'

async function getCountry({
  codes,
  withContinent
}: {
  codes?: string[]
  withContinent?: boolean
}) {
  return client.queries.countries({
    // If `codes` is `undefined`, the arguments will be skipped.
    $args: {
      filter: {
        code: { in: codes }
      }
    },

    code: true,
    name: {
      // Setting alias to the `name` field.
      $alias: 'name_zh',
      // Passing arguments to the `name` field.
      $args: { lang: 'zh' }
    },

    continent: {
      // Using the `@include` directive.
      $directives: {
        name: '@include',
        args: { if: withContinent }
      },

      code: true,
      name: true
    }
  })
}

getCountry({
  codes: ['BR'],
  withContinent: false
}).then((countries) => {
  console.log(countries)
})
```

Next, you can [read the docs of `generate-graphql-query`](./packages/generate-graphql-query/README.md) to get familiar with the format of the argument of `generateQuery`. Especially if you want to know [how to pass enumeration values to the server](./packages/generate-graphql-query/README.md#enumerations).

## License

[MIT](./LICENSE)
