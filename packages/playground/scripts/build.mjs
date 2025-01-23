import { generate } from 'generate-graphql-client'

generate({
  files: [
    {
      endpoint: 'http://localhost:8081/query',
      output: 'src/graphql/types.ts',
      options: {
        headers: ['/* eslint-disable */'],
        scalarTypes: {
          "Cursor": "string",
          "Time": "string",
        }
      }
    }
  ]
})
