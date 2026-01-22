import { $Operation, MutationFields, QueryFields } from './github'

type GraphqlOperation = {
  query?: $Operation<QueryFields>
  mutation?: $Operation<MutationFields>
}

const operation: GraphqlOperation = {
  query: {
    $variables: {
      $login: `String!`
    },
    user: {
      $args: {
        login: { $var: '$login' }
      }
    }
  }
}

console.log(operation)
