import generateGraphQL from '..'

const query = generateGraphQL({
  mutation: {
    // Use `$fields` array to make sure the order of multiple fields
    // is correct. In this example, the mutation `operationB` is
    // guaranteed to finish before the mutation `operationA` begins.
    $fields: [
      {
        operationB: {
          $args: { id: '1000' },
          status: true
        }
      },
      {
        operationA: {
          $args: { id: '1000' },
          status: true
        }
      }
    ]
  }
})

console.log(query)
console.log('')
