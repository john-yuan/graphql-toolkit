import { generateQuery } from 'generate-graphql-query'
import { GraphqlOperation } from './github'

const operation: GraphqlOperation = {
  query: {
    $variables: {
      $repo: `String!`
    },
    repository: {
      $args: {
        name: { $var: '$repo' },
        owner: 'john-yuan'
      },
      id: true
    }
  }
}

console.log(operation)

const query = generateQuery<GraphqlOperation>({
  query: {
    $variables: {
      $login: 'String!'
    },
    user: {
      $args: {
        login: { $var: '$login' }
      },
      id: true
    }
  }
})

console.log(query)
