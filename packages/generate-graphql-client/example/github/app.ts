import { client } from './client'
import { Repository } from './github'

client.queries
  .node({
    $args: {
      id: '1'
    },
    $on: {
      Repository: {
        id: 1,
        name: 1,
        createdAt: 1
      }
    }
  })
  .then((node) => {
    if (node && node.__typename === 'Repository') {
      const repo = node as Repository
      console.log(repo.name)
    }
  })
