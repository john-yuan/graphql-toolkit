import generateGraphQL from '..'

const query = generateGraphQL({
  // Building `query`.
  query: {
    // Querying `countries`.
    countries: {
      // Specify arguments for `countries`.
      $args: {
        filter: {
          continent: {
            in: ['AF']
          }
        }
      },

      // Selecting the fields we want to fetch.
      code: true,

      // We can also use numbers, for it is shorter than boolean.
      // Zero will be treated as `false`. Any other value will be
      // treated as `true`.
      name: 1,

      // Selecting nested object.
      continent: {
        code: 1,

        // If the value is string, the string will be used as alias.
        name: 'continent_name'
      }
    }
  }
})

console.log(query)
console.log('')
