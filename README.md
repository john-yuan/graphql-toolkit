# MyGQL

GraphQL tools to convert GraphQL introspection to TypeScript code and generate GraphQL query from JavaScript object.

This repository contains the following two packages:

- [`@mygql/codegen`](./packages/codegen/) A command line tool to generate TypeScript code from your GraphQL introspection (via JSON file or URL). This module should be installed as dev dependency. You can [click here to read the docs](./packages/codegen/README.md).
- [`@mygql/graphql`](./packages/graphql/) A module to help us generate GraphQL query from JavaScript object. This module has **zero dependency** and the bundle size of it is small (**under 3kB**). This module should be installed as dependency for your web application. You can [click here to read the docs](./packages/graphql/README.md).

To get started, [please read the docs of `@mygql/codegen`](./packages/codegen/README.md). You can also [click here to try MyGQL online](https://mygqljs.github.io/).
