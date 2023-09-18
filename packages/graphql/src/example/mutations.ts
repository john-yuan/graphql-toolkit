import generateGraphQL from '..'

const query = generateGraphQL({
  mutation: {
    updateUser: {
      $args: {
        id: '1000',
        name: 'joe'
      },

      name: true
    }
  }
})

console.log(query)
console.log('')
