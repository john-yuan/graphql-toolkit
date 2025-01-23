import { generateQuery } from '..'

const query = generateQuery({
  query: {
    countries: {
      $on: {
        // omit the type
        $: {
          name: true
        },
        Country: {
          $directives: {
            name: '@skip',
            args: { if: false }
          },
          name: true
        }
      }
    }
  }
})

console.log(query)
console.log('')
