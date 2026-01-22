import { generateQuery } from 'generate-graphql-query'
import createGraphQLClient from './gitlab'

const sendQuery = async (query: string) => {
  return fetch('https://gitlab.com/api/graphql/', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  }).then((res) => res.json())
}

export const client = createGraphQLClient(async (type, name, payload) => {
  if (name === null) {
    return sendQuery(generateQuery({ [type]: payload }))
  }

  return sendQuery(generateQuery({ [type]: { [name]: payload } })).then(
    (res) => {
      if (res.errors?.[0]) {
        throw new Error(res.errors[0].message)
      }
      return res.data[name]
    }
  )
})
