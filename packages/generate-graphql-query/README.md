# README

[![npm version](https://img.shields.io/npm/v/generate-graphql-query.svg)](https://www.npmjs.com/package/generate-graphql-query)
[![coverage](https://cdn.jsdelivr.net/gh/john-yuan/graphql-toolkit@main/packages/generate-graphql-query/coverage/badges.svg)](./coverage/coverage.txt)

<!-- [![npm downloads](https://img.shields.io/npm/dm/generate-graphql-query.svg)](http://npm-stat.com/charts.html?package=generate-graphql-query) -->

This package is designed to generate GraphQL code from plain JavaScript objects. We also provide a companion package for generating a type-safe GraphQL client in TypeScript from your GraphQL schema file or endpoint, which works seamlessly with this package. [See the documentation on GitHub for more details](https://github.com/john-yuan/graphql-toolkit).

## Get started

```bash
npm i generate-graphql-query
```

Generate GraphQL query from JavaScript object.

Example:

```ts
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
  query: {
    countries: {
      code: true,
      name: true,
      continent: {
        name: true
      }
    }
  }
})

console.log(query)
```

Output:

<!-- prettier-ignore-start -->
```gql
query {
  countries {
    code
    name
    continent {
      name
    }
  }
}
```
<!-- prettier-ignore-end -->

This module supports queries, mutations, aliases, arguments, directives, enumerations, fragments and variables.

> You can use the [`generate-graphql-client`](https://www.npmjs.com/package/generate-graphql-client) module to generate TypeScript code from your GraphQL introspection and use this module to generate the GraphQL query that to be sent to the server.

To get started with GraphQL Toolkit , [you can click here to read the documentation](https://github.com/john-yuan/graphql-toolkit#readme). To try GraphQL Toolkit online, [you can click here to visit our online playground](https://mygqljs.github.io/playground/).

Table of contents:

- [Usage](#usage)
  - [Basic usage](#basic-usage)
  - [Using alias](#using-alias)
  - [Arguments](#arguments)
  - [Arguments for sub-fields](#arguments-for-sub-fields)
  - [Passing empty objects in the arguments with `$raw` or `$keep`](#passing-empty-objects-in-the-arguments-with-raw-or-keep)
  - [Enumerations](#enumerations)
  - [Variables](#variables)
  - [Directives](#directives)
  - [Fragments](#fragments)
  - [Inline fragments](#inline-fragments)
  - [Mutations](#mutations)
  - [Multiple fields in mutations](#multiple-fields-in-mutations)
  - [Using CDN](#using-cdn)

## Usage

### Basic usage

```ts
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
  query: {
    /**
     * Optional operation name.
     */
    $name: 'CountriesQuery',

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

      // We can also use numbers, for they are shorter than booleans.
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
query CountriesQuery {
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
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
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
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
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

          // If the value is an object with a key named `$enum`, the value
          // will be processed as enumeration. In our example, the value
          // `DESC` will not be double-quoted in the result for it is a
          // enumeration value.
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

### Arguments for sub-fields

```ts
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
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
```

The output is:

<!-- prettier-ignore-start -->
```gql
query {
  country (
    code: "CN"
  ) {
    name (
      lang: "zh"
    )
  }
}
```
<!-- prettier-ignore-end -->

### Passing empty objects in the arguments with `$raw` or `$keep`

As you can see in the previous example of arguments, the value with an empty object in the arguments will be skipped. But sometimes we need to pass empty object to the server, for example clearing all fields in a JSON field. To achieve that, we can use `$raw` or `$keep` to pass empty objects.

```ts
import { generateQuery } from 'generate-graphql-query'

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

### Enumerations

```ts
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
  query: {
    users: {
      $args: {
        // Enum is an object with a key named `$enum`.
        // The enum value will not be double-quoted.
        statusIn: [{ $enum: 'VERIFIED' }],

        orderBy: {
          field: 'created_at',
          direction: { $enum: 'DESC' }
        }
      },

      id: 1,
      name: 1
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
    statusIn: [VERIFIED]
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

### Variables

```ts
import { generateQuery } from 'generate-graphql-query'

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
```

The output is:

<!-- prettier-ignore-start -->
```gql
query (
  $codes: [String!]! = []
) {
  countries (
    filter: {
      code: {
        in: $codes
      }
    }
  ) {
    code
    name
  }
}
```
<!-- prettier-ignore-end -->

### Directives

```ts
import { generateQuery } from 'generate-graphql-query'

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
```

The output is:

<!-- prettier-ignore-start -->
```gql
query {
  directivesExample {
    field1 @skip(if: false)
    field2 @include (
      if: true
    )
    field3 @skip(if: false) @my_directive (
      arg: "value"
    )
  }
}
```
<!-- prettier-ignore-end -->

### Fragments

Basic usage:

```ts
import { generateQuery } from 'generate-graphql-query'

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
      $spread: 'countryFields'
    }
  }
})

console.log(query)
```

The output is:

<!-- prettier-ignore-start -->
```gql
query {
  countries {
    ...countryFields
  }
}

fragment countryFields on Country {
  code
  name
}
```
<!-- prettier-ignore-end -->

We can also use directives with fragments:

```ts
import { generateQuery } from 'generate-graphql-query'

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
```

The output is:

<!-- prettier-ignore-start -->
```gql
query {
  countries {
    ...countryFields @skip(if: false)
  }
}

fragment countryFields on Country {
  code
  name
}
```
<!-- prettier-ignore-end -->

### Inline fragments

```ts
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
  query: {
    countries: {
      $on: {
        // We can use `$` to indicates that we want to omit the type name.
        $: {
          name: true
        },

        // Fragment on the type `Country`.
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
```

The output is:

<!-- prettier-ignore-start -->
```gql
query {
  countries {
    ... {
      name
    }
    ... on Country @skip (
      if: false
    ) {
      name
    }
  }
}
```
<!-- prettier-ignore-end -->

### Mutations

```ts
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
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
```

The output is:

<!-- prettier-ignore-start -->
```gql
mutation {
  updateUser (
    id: "1000"
    name: "joe"
  ) {
    name
  }
}
```
<!-- prettier-ignore-end -->

### Multiple fields in mutations

Because [**mutation fields run in series, one after the other**](https://graphql.org/learn/queries/#multiple-fields-in-mutations). So the order of the fields in a mutation is very important to avoid race condition. To make sure the field order is correct, we should use the `$fields` array to ensure the order. Below is an example:

```ts
import { generateQuery } from 'generate-graphql-query'

const query = generateQuery({
  mutation: {
    // Use `$fields` array to make sure the order of multiple fields
    // is correct. In this example, the mutation `operationB` is
    // guaranteed to finish before the mutation `operationA` begins.
    $fields: [
      {
        operationB: {
          $args: { id: '1000' },
          status: true
        }
      },
      {
        operationA: {
          $args: { id: '1000' },
          status: true
        }
      }
    ]
  }
})

console.log(query)
```

The output is:

<!-- prettier-ignore-start -->
```gql
mutation {
  operationB (
    id: "1000"
  ) {
    status
  }
  operationA (
    id: "1000"
  ) {
    status
  }
}
```
<!-- prettier-ignore-end -->

## Using CDN

From the version `1.1.0`, we can load this module by a CDN like unpkg directly.

Example:

<!-- prettier-ignore-start -->
```html
<script src="https://unpkg.com/generate-graphql-query/browser/index.js"></script>
<script>
  var query = GraphQLToolkit.generateQuery({
    query: {
      countries: {
        code: true,
        name: true
      }
    }
  })

  console.log(query)
</script>
```
<!-- prettier-ignore-end -->
