import generateGraphQL from '..'

const query = generateGraphQL({
  query: {
    users: {
      $args: {
        // Enum is an object with a key named `$enum`.
        // The enum value will not be double-quoted.
        statusIn: [{ $enum: 'VERIFIED' }],

        orderBy: {
          field: 'created_at',
          direction: { $enum: 'DESC' }
        }
      },

      id: 1,
      name: 1
    }
  }
})

console.log(query)
console.log('')
