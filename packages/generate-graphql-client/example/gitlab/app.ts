import { client } from './client'
import type { Group } from './gitlab'

client.queries
  .group({
    $args: {
      fullPath: 'gitlab-org'
    },
    __typename: true,
    id: true,
    name: true,
    projects: {
      nodes: {
        id: true,
        name: true,
        createdAt: true
      }
    }
  })
  .then((node) => {
    console.log(node)
    if (node && node.__typename === 'Group') {
      const group = node as Group
      console.log(`Group name: ${group.name}`)
      node.projects?.nodes?.forEach((project) => {
        console.log(`Project: ${project?.name}`)
      })
    }
  })
