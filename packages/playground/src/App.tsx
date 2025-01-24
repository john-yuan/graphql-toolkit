import { useCallback, useState } from "react"
import { client } from "./graphql/client"

export default function App() {
  const queryStuffs = useCallback(() => {
    client.queries.stuffs({
      __typename:1,
      $on: {
        TextBook: {
          id: 1,
          author: 1,
          isbn: 1,
          name: 1
        },
        Laptop: {
          brand: 1,
          processor: 1,
          memory: 1,
          storage: 1,
        }
      }
    }, { cache: 'network-only'} ).then((res) => {
      console.log(res)
    })
  }, [])

  const queryBooks = useCallback(() => {
    client.queries.books({
      pageInfo: {
        startCursor: 1,
        endCursor: 1,
        hasNextPage: 1,
        hasPreviousPage: 1,
      },
      totalCount: 1,
      edges: {
        node: {
          author: 1,
          name: 1,
          id: 1,
          isbn: 1,
        }
      }
    }).then((res) => {
      console.log(res)
    })
  }, [])

  console.log({client})

  return (
    <div>
      <button onClick={queryStuffs}>Query Stuffs</button>
      <br />
      <button onClick={queryBooks}>Query Books</button>

      <TodoForm />
    </div>
  )
}


function TodoForm() {
  const [input, setInput] = useState('')
  return (
    <div style={{marginTop: 16}}>
      <textarea value={input} onChange={(e) => {
        setInput(e.target.value)
      }} />
      <br />
      <button onClick={() => {
        client.mutations.createTodo({
          $args: {
            input: {
              text: input,
              createdAt: new Date().toISOString(),
              priority: 1,
              status: { $enum: 'IN_PROGRESS' }
            }
          },
          id: 1,
          status: 1,
          createdAt: 1,
        }).then((res) => {
          alert(res ? 'success: ' + (res.id + ' ' + res.status) : 'error')
        })
      }}>create todo</button>
    </div>
  )
}
