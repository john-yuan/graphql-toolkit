import { generateQuery } from '..'

const query = generateQuery({
  mutation: {
    someAction: {
      $args: {
        // The following two objects will be skipped, for they are empty.
        skippedEmptyObject1: {},
        skippedEmptyObject2: { undefinedField: undefined },

        // To keep empty object, we can use the `$keep` flag.
        emptyObject1: { $keep: true },
        emptyObject2: { $keep: true, undefinedField: undefined },

        // We can also use `$raw` to pass objects.
        emptyObject3: { $raw: '{}' },

        // Actually, we can pass any type of value with `$raw`.
        numberWithRaw: { $raw: 1 },
        boolWithRaw: { $raw: true }
      }
    }
  }
})

console.log(query)
console.log('')
