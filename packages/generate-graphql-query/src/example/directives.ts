import { generateQuery } from '..'

const query = generateQuery({
  query: {
    directivesExample: {
      // Use string to set directive.
      field1: {
        $directives: '@skip(if: false)'
      },

      // Use object to set directive.
      field2: {
        $directives: {
          name: '@include',
          args: { if: true }
        }
      },

      // Use array to set multiple directives.
      field3: {
        $directives: [
          '@skip(if: false)',
          {
            name: '@my_directive',
            args: { arg: 'value' }
          }
        ]
      }
    }
  }
})

console.log(query)
console.log('')
