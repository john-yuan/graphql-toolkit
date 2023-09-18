import generateGraphQL from '..'

const query = generateGraphQL({
  query: {
    users: {
      $args: {
        // Values will be encoded to corresponding types in GraphQL.
        nameContains: 'a',
        verified: true,
        deletedAt: null,
        status: 1,

        // Argument can be nested object.
        hasFriendsWith: {
          nameContains: 'b',
          deletedAt: null
        },

        orderBy: {
          field: 'created_at',

          // If the value is an object with only one key named `$enum`,
          // the value will be processed as enumeration. In our example,
          // the value `DESC` will not be double-quoted in the result
          // for is is a enumeration value.
          direction: { $enum: 'DESC' }
        },

        // If the value is `undefined` or if the argument is empty,
        // the argument will be skipped.
        role: undefined,
        hasRoleWith: {}
      },

      id: true,
      name: true
    }
  }
})

console.log(query)
console.log('')
