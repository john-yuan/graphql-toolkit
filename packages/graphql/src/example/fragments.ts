import generateGraphQL from '..'

const query = generateGraphQL({
  fragments: {
    // Declare a fragment named `countryFields` on the type `Country`.
    countryFields: {
      $on: 'Country',
      code: true,
      name: true
    }
  },
  query: {
    countries: {
      // Use the fragment named `countryFields`.
      $fragments: [{ spread: 'countryFields' }]
    }
  }
})

console.log(query)
console.log('')
