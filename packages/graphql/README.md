# README

Build GraphQL query from JavaScript object.

This module supports fragments, variables, directives, aliases, enumerations and arguments.

## Installation

```bash
npm i @mygql/graphql
```

## Usage

### Basic usage

```ts
import generateGraphQL from '@mygql/graphql'

const query = generateGraphQL({
  // Building `query`.
  query: {
    // Querying `countries`.
    countries: {
      // Specify arguments for `countries`.
      $args: {
        filter: {
          continent: {
            in: ['AF']
          }
        }
      },

      // Selecting the fields we want to fetch.
      code: true,

      // We can also use numbers, for it is shorter than boolean.
      // Zero will be treated as `false`. Any other value will be
      // treated as `true`.
      name: 1,

      // Selecting nested object.
      continent: {
        code: 1,

        // If the value is string, the string will be used as alias.
        name: 'continent_name'
      }
    }
  }
})

console.log(query)
```

The output is:

<!-- prettier-ignore-start -->
```gql
query {
  countries (
    filter: {
      continent: {
        in: ["AF"]
      }
    }
  ) {
    code
    name
    continent {
      code
      continent_name: name
    }
  }
}
```
<!-- prettier-ignore-end -->

### Using alias

```ts
import generateGraphQL from '@mygql/graphql'

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
```

The output is:

<!-- prettier-ignore-start -->
```gql
query {
  country_fr: country (
    code: "FR"
  ) {
    country_code: code
    country_name: name
  }
  af_countries: countries (
    filter: {
      continent: {
        eq: "AF"
      }
    }
  ) {
    code
    name
  }
  as_countries: countries (
    filter: {
      continent: {
        eq: "AS"
      }
    }
  ) {
    code
    name
  }
}
```
<!-- prettier-ignore-end -->

### Arguments

```ts
import generateGraphQL from '@mygql/graphql'

const query = generateGraphQL({
  query: {
    users: {
      $args: {
        // Values will be encoded to corresponding types in GraphQL.
        nameContains: 'a',
        verified: true,
        deletedAt: null,
        status: 1,

        // Argument can be nested object.
        hasFriendsWith: {
          nameContains: 'b',
          deletedAt: null
        },

        orderBy: {
          field: 'created_at',

          // If the value is an object with only one key named `$enum`,
          // the value will be processed as enumeration. In our example,
          // the value `DESC` will not be double-quoted in the result
          // for is is a enumeration value.
          direction: { $enum: 'DESC' }
        },

        // If the value is `undefined` or if the argument is empty,
        // the argument will be skipped.
        role: undefined,
        hasRoleWith: {}
      },

      id: true,
      name: true
    }
  }
})

console.log(query)
```

The output is:

<!-- prettier-ignore-start -->
```gql
query {
  users (
    nameContains: "a"
    verified: true
    deletedAt: null
    status: 1
    hasFriendsWith: {
      nameContains: "b"
      deletedAt: null
    }
    orderBy: {
      field: "created_at"
      direction: DESC
    }
  ) {
    id
    name
  }
}
```
<!-- prettier-ignore-end -->

### Passing empty objects in the arguments with `$raw` or `$keep`

As you can see in the previous example of arguments, the value with an empty object in the arguments will be skipped. But sometimes we need passing empty object to the server, for example clearing all fields in a JSON field. To achieve that, we can use `$raw` or `$keep` to pass empty objects.

```ts
import generateGraphQL from '@mygql/graphql'

const query = generateGraphQL({
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
```

The output is:

<!-- prettier-ignore-start -->
```gql
mutation {
  someAction (
    emptyObject1: {}
    emptyObject2: {}
    emptyObject3: {}
    numberWithRaw: 1
    boolWithRaw: true
  )
}
```
<!-- prettier-ignore-end -->
