# MyGQL

A tool to convert GraphQL introspection to TypeScript code and generate GraphQL query from JavaScript object.

This repository contains the following two packages:

- [`@mygql/codegen`](./packages/codegen/) A command line tool to generate TypeScript code from your GraphQL introspection (via JSON file or URL). This module should be installed as dev dependency. You can [click here to read the docs](./packages/codegen/README.md).
- [`@mygql/graphql`](./packages/graphql/) A module to help us generate GraphQL query from JavaScript object. This module has **zero dependencies** and the bundle size of it is small (**under 3kB**). This module should be installed as dependency for your web application. You can [click here to read the docs](./packages/graphql/README.md).

You can [click here to try MyGQL online](https://mygqljs.github.io/playground/).

## Introduction

MyGQL is a lightweight toolkit for GraphQL client in TypeScript. It helps us to interact with GraphQL APIs in a type-safe way.

MyGQL has a command line tool which can generate all types (enums, unions, objects and inputs) found in your GraphQL introspection to TypeScript code (with related comments in the schema). It also generates a factory function which we can use to create a GraphQL client. The created client supports every operation (queries and mutations) your GraphQL API provides.

If we are not using MyGQL, we may write some code like the following snippet:

```ts
type Country = {
  code: string
  name: string
}

const continentCodes = ['AF']

const query = `
  query {
    countries (
      filter: {
        continent: {
          in: ${JSON.stringify(continentCodes)}
        }
      }
    ) {
      code
      name
    }
  }
`

sendQuery<{ countries: Country[] }>(query).then((res) => {
  console.log(res.data?.countries)
})
```

The code will work as expected. However, it has the following disadvantages:

- We have to define the type manually.
- The query is constructed by concatenating string which can be error-prone.
- Since the query is a string, it cannot be type checked.

With the client created with the factory function generated by MyGQL, now we can write our code like the following snippet:

```ts
client.queries
  .countries({
    $args: {
      filter: {
        continent: {
          in: ['AF']
        }
      }
    },

    code: true,
    name: true
  })
  .then((countries) => {
    countries.forEach((country) => {
      // The type of country is `Country`.
      console.log(country.name)
    })
  })
```

The code above is type-safe because the argument and return value are typed. Because the values are typed, now our code can get autocompleted thanks to TypeScript. Plus, we don't need to build our query manually anymore. MyGQL will generate the query based on the argument we passed in.

In the above example, we only send one query (of which the name is `countries`) to the server. GraphQL allow us to send multiple queries in a single request. To do that with MyGQL, we can use the `client.query` method. For example:

```ts
client
  .query({
    continents: {
      code: true,
      name: true
    },
    countries: {
      code: true,
      name: true
    }
  })
  .then((res) => {
    if (res.data) {
      console.log(res.data.continents)
      console.log(res.data.countries)
    }
  })
```

The generated client has the following properties:

- `query` A function that can be used to send multiple queries.
- `quires` An object containing all query methods the GraphQL API supports.
- `mutation` A function that can be used to send multiple mutations.
- `mutations` An object containing all mutation methods the GraphQL API supports.

> Note: If the GraphQL API does not provide any queries, `query` and `queries` will not be generated. And if the GraphQL API does not provide any mutations, `mutation` and `mutations` will not be generated.

## Get started

In the previous section, we have introduced MyGQL. Now it's time to get started.

Firstly, we should install the command line tool we mentioned before:

```bash
npm i @mygql/codegen --save-dev
```

> If you don't want to install the command right now, there is a MyGQL online playground that you can paste your GraphQL introspection JSON in and then get the TypeScript output. [Click here to try the online playground](https://mygqljs.github.io/playground/#codegen).

Next, we should create a config file. In our example, we will save our config file to `<root>/src/graphql/config.json`, and the content of config is:

```json
{
  "files": [
    {
      "filename": "./countries.json",
      "output": "./countries.ts"
    }
  ]
}
```

The `filename` is the path of the GraphQL introspection file. [You can click here to learn how to query the introspection from your GraphQL endpoint](./packages/codegen/README.md#how-to-get-graphql-introspection).

> The `countries.json` in the example config is a GraphQL introspection file we grabbed from [https://countries.trevorblades.com](https://countries.trevorblades.com/). You can [find the content of `countries.json` here](./packages/codegen/example/countries.json).

Now we can run the `codegen` command to generate TypeScript code for us:

```bash
npx @mygql/codegen --config src/graphql/config.json
```

The generated code will be saved to the `<root>/src/graphql/countries.ts` as we configured in `config.json` (by the way the paths in `config.json` is relative to the path of `config.json`).

The `countries.ts` file contains all types we found in the introspection (`countries.json`) and exports a function named `createGraphQLClient` as its default export. We can use this function to create our GraphQL client. But before that, we should install `@mygql/graphql`. This module will help us generate query from JavaScript object.

```bash
# @mygql/graphql has zero dependency and its bundle size is small
npm i @mygql/graphql --save
```

Now, create new a file and save it to `<root>/src/graphql/client.ts` with the following content:

```ts
// We will use @mygql/graphql to generate the query.
import generateGraphQL from '@mygql/graphql'

// Import the generated factory function.
import createGraphQLClient from './countries'

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
      return sendQuery(generateGraphQL({ [type]: payload }))
    }

    // If `name` is a string, means that the caller function is `queries.xxx()`
    // or `mutations.xxx()` and `payload` is the first parameter of
    // `queries.xxx()` or `mutations.xxx()`. In this case, we should return
    // the expected data and throw error if something went wrong.
    return sendQuery(generateGraphQL({ [type]: { [name]: payload } })).then(
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
import client from '@/graphql/client'

// Get country by the code.
client.queries
  .country({
    $args: { code: 'BR' },
    name: true,
    capital: true,
    currency: true,
    languages: { code: true, name: true }
  })
  .then((country) => {
    console.log(country)
  })
```

Below is a more complicated example. This example demonstrates the following features:

- Dynamic arguments.
- Passing Arguments to sub-fields.
- Using alias.
- Using directives.

```ts
import client from '@/graphql/client'

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

getCountry({ codes: ['BR'], withContinent: false }).then((countries) => {
  console.log(countries)
})
```

Next, you can [read the docs of `@mygql/graphql`](./packages/graphql/README.md) to get familiar with the format of the argument of `generateGraphQL`. Especially if you want to know [how to pass enumeration values to the server](./packages/graphql/README.md#enumerations).

## License

[MIT](./LICENSE)
