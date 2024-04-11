import { generateQuery } from '..'

const query = generateQuery({
  query: {
    $variables: {
      // Declare a variable named `$codes`.
      $codes: `[String!]! = []`
    },

    countries: {
      // Use the variable named `$codes`.
      $args: {
        filter: {
          code: {
            // Variable is an object with a key named `$var`.
            in: { $var: '$codes' }
          }
        }
      },

      code: true,
      name: true
    }
  }
})

console.log(query)
console.log('')
