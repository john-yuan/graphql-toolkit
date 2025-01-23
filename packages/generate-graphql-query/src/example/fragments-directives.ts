import { generateQuery } from '..'

const query = generateQuery({
  fragments: {
    // Declare a fragment named `countryFields` on the type `Country`.
    countryFields: {
      $onType: 'Country',
      code: true,
      name: true
    }
  },
  query: {
    countries: {
      // Use the fragment named `countryFields`.
      $spread: { name: 'countryFields', directives: '@skip(if: false)' }
    }
  }
})

console.log(query)
console.log('')
