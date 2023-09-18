import generateGraphQL from '..'

const query = generateGraphQL({
  query: {
    country: {
      $args: { code: 'CN' },

      // Set arguments for the field.
      name: {
        $args: { lang: 'zh' }
      }
    }
  }
})

console.log(query)
console.log('')
