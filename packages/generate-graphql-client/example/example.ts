import { client } from './client'
import type { Order } from './generated'

client.queries
  .user({
    id: 1,
    name: 1,
    friends: {
      $args: {
        page: 1,
        size: 50
      },
      total: 1,
      data: {
        id: 1,
        name: 1
      }
    },
    orders: {
      $args: {
        page: 1,
        size: 10,
        filter: {
          createdAtGTE: new Date(2025, 0, 1).toISOString()
        }
      }
    },
    media: {
      total: 1,
      data: {
        $on: {
          Book: {
            __typename: 1,
            id: 1,
            name: 1,
            author: 1
          },
          Movie: {
            __typename: 1,
            id: 1,
            name: 1,
            duration: 1
          }
        }
      }
    }
  })
  .then((user) => {
    // The type of user is `User`.
    console.log(user)
  })

client.queries
  .node({
    $args: {
      id: '90637ac272688d55c28679795d46aa904ec5de67'
    },
    id: 1,
    $on: {
      Order: {
        __typename: 1,
        id: 1,
        createdAt: 1
      }
    }
  })
  .then((node) => {
    // The type of node is `Node | null`
    if (node) {
      const order = node as Order
      console.log(order.createdAt)
    }
  })
