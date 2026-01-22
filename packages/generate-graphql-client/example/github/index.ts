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
