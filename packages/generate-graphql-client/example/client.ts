// We will use generate-graphql-query to generate the query.
import { generateQuery } from 'generate-graphql-query'

// Import the generated factory function.
import createGraphQLClient from './generated'

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
  // handle the options.
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
 * the async function accepts the following for parameters:
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
