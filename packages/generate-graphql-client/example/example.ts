import { client } from './client'
import type { Country, Order } from './generated'

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

client.mutations.createBook({
  $args: {
    input: {
      author: {
        $keep: true
      }
    }
  },
  id: 1
})

client.queries
  .country<{
    country_code: string
    country_name: string
  } | null>({
    $args: { code: 'FR' },
    code: 'country_code',
    name: 'country_name'
  })
  .then((country) => {
    console.log(country)
  })

client
  .query<{
    country_fr: {
      country_code: string
      country_name: string
    } | null
    af_countries: Country[]
    as_countries: Country[]
  }>({
    country: {
      $alias: 'country_fr',
      $args: { code: 'FR' },

      code: 'country_code',
      name: { $alias: 'country_name' }
    },

    countries: [
      {
        $alias: 'af_countries',
        $args: {
          filter: {
            continent: { eq: 'AF' }
          }
        },
        code: true,
        name: true
      },
      {
        $alias: 'as_countries',
        $args: {
          filter: {
            continent: { eq: 'AS' }
          }
        },
        code: true,
        name: true
      }
    ]
  })
  .then((res) => {
    console.log(res.data?.country_fr)
    console.log(res.data?.af_countries)
    console.log(res.data?.as_countries)
  })

client.mutation({
  $fields: [
    {
      createBook: {
        $args: {
          input: {
            name: 'Book 1',
            author: {
              name: 'John'
            }
          }
        }
      }
    },
    {
      createBook: {
        $alias: 'createdSecondBook',
        $args: {
          input: {
            name: 'Book 2',
            author: {
              name: 'John'
            }
          }
        }
      }
    }
  ]
})
