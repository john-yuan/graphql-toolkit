# README

[![npm version](https://img.shields.io/npm/v/generate-graphql-introspection.svg)](https://www.npmjs.com/package/generate-graphql-introspection)

Generate introspection from GraphQL schema.

```sh
npm i generate-graphql-introspection --save-dev
```

Usage:

```sh
npx generate-graphql-introspection -s schema.graphql -o introspection.json
```

## Command

```txt
Usage:
  # All .graphql files in the graphql directory
  generate-graphql-introspection -s "graphql/*.graphql" -o introspection.json

  # Specify one file
  generate-graphql-introspection -s graphql/schema.graphql -o introspection.json

  # Specify multiple files
  generate-graphql-introspection -s graphql/user.graphql -s graphql/order.graphql -o introspection.json

Options:
  -s --source    Specify the source glob.
  -i --ignore    Specify the rule to ignore files in source.
  -o --output    Specify the output file.
  -h --help      Print help message.
```

## Programmatically usage

```ts
import { generateGraphQLIntrospection } from 'generate-graphql-introspection'

generateGraphQLIntrospection({
  source: ['graphql/*.graphql'],
  output: 'introspection.json'
})
```
