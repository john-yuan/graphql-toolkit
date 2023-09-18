import generateGraphQL from '..'

const query = generateGraphQL({
  query: {
    // Example of defining alias for the field.
    country: {
      $alias: 'country_fr',
      $args: { code: 'FR' },

      // We can use string to set alias.
      code: 'country_code',
      // We can also use object to set alias.
      name: { $alias: 'country_name' }
    },

    // Example of defining two aliases for the same field.
    countries: [
      {
        $alias: 'af_countries',
        $args: { filter: { continent: { eq: 'AF' } } },
        code: true,
        name: true
      },
      {
        $alias: 'as_countries',
        $args: { filter: { continent: { eq: 'AS' } } },
        code: true,
        name: true
      }
    ]
  }
})

console.log(query)
console.log('')
