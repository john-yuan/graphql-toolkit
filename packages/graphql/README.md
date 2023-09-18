# README

Build GraphQL query from JavaScript object.

Supports fragments, variables, directives, aliases, enumerations and arguments.

## Installation

```bash
npm i @mygql/graphql
```

## Usage

### Basic usage

```ts
import generateGraphQL from '..'

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
import generateGraphQL from '..'

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
