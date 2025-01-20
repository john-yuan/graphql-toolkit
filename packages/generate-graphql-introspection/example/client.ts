// We will use generate-graphql-query to generate the query.
import { generateQuery } from 'generate-graphql-query'

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

// Example to query continents and countries. The sent GraphQL code is:
// query {
//   continents {
//     code
//     name
//   }
//   countries {
//     code
//     name(lang: "en")
//   }
// }
client
  .query({
    continents: {
      code: true,
      name: true
    },
    countries: {
      code: true,
      name: { $args: { lang: 'en' } }
    }
  })
  .then((res) => {
    if (res.errors) {
      // handle errors
    }
    console.log(res.data?.countries)
  })

// Or you can use the methods in the `queries` object.
// Here is an example. The sent GraphQL code is:
// query {
//   countries(filter: {code: {in: ["CN", "US"]}}) {
//     code
//     name
//   }
// }
client.queries
  .countries({
    $args: {
      filter: {
        code: { in: ['CN', 'US'] }
      }
    },
    code: true,
    name: true
  })
  .then((countries) => {
    console.log(countries)
  })
  .catch((err) => {
    console.error(err)
  })
