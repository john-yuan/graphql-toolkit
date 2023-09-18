import generateGraphQL from '..'

const query = generateGraphQL({
  query: {
    countries: {
      $fragments: [
        // Inline fragment on the type `Country`.
        {
          inline: {
            $on: 'Country',
            // Set directives for the fragment.
            $directives: {
              name: '@skip',
              args: { if: false }
            },
            name: true
          }
        },
        // The type can be omitted.
        {
          inline: {
            code: true
          }
        }
      ]
    }
  }
})

console.log(query)
console.log('')
