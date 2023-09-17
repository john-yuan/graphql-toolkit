import generateGraphQL from '.'

describe('operation type', () => {
  test('query', () => {
    expect(
      generateGraphQL({
        query: {
          users: {
            $args: {
              first: 10
            },

            id: true,
            name: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        users (
          first: 10
        ) {
          id
          name
        }
      }"
    `)
  })

  test('mutation', () => {
    expect(
      generateGraphQL({
        mutation: {
          deleteUser: {
            $args: { id: 1 }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "mutation {
        deleteUser (
          id: 1
        )
      }"
    `)
  })

  test('subscription', () => {
    expect(
      generateGraphQL({
        subscription: {
          story: {
            id: true,
            content: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "subscription {
        story {
          id
          content
        }
      }"
    `)
  })
})

describe('fragment declarations', () => {
  test('declare fragment', () => {
    expect(
      generateGraphQL({
        fragments: {
          userFields: {
            $on: 'User',

            id: true,
            name: true
          },

          roleFields: {
            $on: 'Role',

            id: true,
            name: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "fragment userFields on User {
        id
        name
      }

      fragment roleFields on Role {
        id
        name
      }"
    `)
  })

  test('declare fragment with array', () => {
    expect(
      generateGraphQL({
        fragments: [
          {
            userFields: {
              $on: 'User',

              id: true,
              name: true
            }
          },
          {
            roleFields: {
              $on: 'Role',

              id: true,
              name: true
            }
          }
        ]
      })
    ).toMatchInlineSnapshot(`
      "fragment userFields on User {
        id
        name
      }

      fragment roleFields on Role {
        id
        name
      }"
    `)
  })
})

describe('operation options', () => {
  test('$name', () => {
    expect(
      generateGraphQL({
        query: {
          $name: 'demoQueryName',
          users: { id: true }
        }
      })
    ).toMatchInlineSnapshot(`
      "query demoQueryName {
        users {
          id
        }
      }"
    `)
  })

  test('$variables', () => {
    expect(
      generateGraphQL({
        query: {
          $variables: {
            $codes: `[String!]! = ["FR"]`
          },

          countries: {
            $args: {
              filter: {
                code: {
                  in: { $var: '$codes' }
                }
              }
            },

            code: true,
            name: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query (
        $codes: [String!]! = ["FR"]
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
      }"
    `)
  })

  test('$directives', () => {
    expect(
      generateGraphQL({
        query: {
          $name: 'queryWithDirectives',

          $directives: [
            '@test_one',
            {
              name: '@test_two'
            },
            {
              name: '@test_three',
              args: {
                key: 'value'
              }
            }
          ],

          users: {
            id: true,
            name: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query queryWithDirectives @test_one @test_two @test_three (
        key: "value"
      ) {
        users {
          id
          name
        }
      }"
    `)
  })

  test('$fragments', () => {
    expect(
      generateGraphQL({
        fragments: {
          countriesFragment: {
            $on: 'Query',

            countries: {
              code: true,
              name: true
            }
          }
        },

        query: {
          $fragments: [{ spread: 'countriesFragment' }]
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        ...countriesFragment
      }

      fragment countriesFragment on Query {
        countries {
          code
          name
        }
      }"
    `)
  })

  test('$fields', () => {
    expect(
      generateGraphQL({
        mutation: {
          $fields: [
            {
              deleteUserRole: { $args: { userId: 1 } }
            },
            {
              deleteUser: { $args: { id: 1 } }
            }
          ]
        }
      })
    ).toMatchInlineSnapshot(`
      "mutation {
        deleteUserRole (
          userId: 1
        )
        deleteUser (
          id: 1
        )
      }"
    `)
  })
})

describe('arguments', () => {
  test('skip empty arguments list', () => {
    expect(
      generateGraphQL({
        query: {
          users: {
            $args: {},
            id: true,
            name: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        users {
          id
          name
        }
      }"
    `)
  })

  test('skip undefined and keep non-undefined', () => {
    expect(
      generateGraphQL({
        query: {
          testArgs: {
            $args: {
              undefinedValue: undefined,
              nullValue: null,
              falseValue: false,
              zeroValue: 0,
              emptyValue: '',
              emptyObject: {}
            },

            id: true,
            object: {}
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        testArgs (
          nullValue: null
          falseValue: false
          zeroValue: 0
          emptyValue: ""
        ) {
          id
          object
        }
      }"
    `)
  })

  test('$enum', () => {
    expect(
      generateGraphQL({
        query: {
          testArgs: {
            $args: {
              statusIn: [{ $enum: 'VERIFIED' }, { $enum: 'PENDING' }],
              orderBy: {
                field: 'created_at',
                direction: { $enum: 'DESC' }
              }
            },

            id: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        testArgs (
          statusIn: [VERIFIED, PENDING]
          orderBy: {
            field: "created_at"
            direction: DESC
          }
        ) {
          id
        }
      }"
    `)
  })

  test('$raw', () => {
    expect(
      generateGraphQL({
        mutation: {
          update: {
            $args: {
              skipEmptyObject: {},
              rawEmptyObject: { $raw: '{}' },
              keepObject: { $keep: true }
            }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "mutation {
        update (
          rawEmptyObject: {}
          keepObject: {}
        )
      }"
    `)
  })

  test('ignore empty string $raw and undefined raw', () => {
    expect(
      generateGraphQL({
        query: {
          testRaw: {
            $args: {
              emptyRaw: { $raw: '' },
              undefinedRaw: { $raw: undefined },
              keepNullRaw: { $raw: null }
            },
            id: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        testRaw (
          keepNullRaw: null
        ) {
          id
        }
      }"
    `)
  })

  test('skip prop starts with $', () => {
    expect(
      generateGraphQL({
        query: {
          testArgs: {
            $args: {
              $skip: true,
              input: {
                $keep: true,
                $other: 3,
                id: 1
              }
            }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        testArgs (
          input: {
            id: 1
          }
        )
      }"
    `)
  })
})

describe('fields', () => {
  test('multiple alias for the same field', () => {
    expect(
      generateGraphQL({
        query: {
          countries: [
            {
              $alias: 'af_countries',
              $args: { filter: { continent: { in: ['AF'] } } },

              code: true,
              name: true
            },
            {
              $alias: 'as_countries',
              $args: { filter: { continent: { in: ['AS'] } } },

              code: true,
              name: true
            }
          ]
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        af_countries: countries (
          filter: {
            continent: {
              in: ["AF"]
            }
          }
        ) {
          code
          name
        }
        as_countries: countries (
          filter: {
            continent: {
              in: ["AS"]
            }
          }
        ) {
          code
          name
        }
      }"
    `)
  })

  test('sub fields', () => {
    expect(
      generateGraphQL({
        query: {
          countries: {
            code: true,
            name: true,
            continent: {
              code: true,
              name: true
            }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        countries {
          code
          name
          continent {
            code
            name
          }
        }
      }"
    `)
  })

  test('arguments of sub fields', () => {
    expect(
      generateGraphQL({
        query: {
          country: {
            $args: { code: 'FR' },

            code: true,
            name: {
              $args: { lang: 'zh' }
            }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        country (
          code: "FR"
        ) {
          code
          name (
            lang: "zh"
          )
        }
      }"
    `)
  })

  test('alias', () => {
    expect(
      generateGraphQL({
        query: {
          countries: {
            code: 'country_code',
            name: { $alias: 'country_name' }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        countries {
          country_code: code
          country_name: name
        }
      }"
    `)
  })

  test('$content', () => {
    expect(
      generateGraphQL({
        query: {
          anything: {
            $content: 'users { id }'
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        users { id }
      }"
    `)
  })

  test('$body', () => {
    expect(
      generateGraphQL({
        query: {
          users: {
            $body: '{ id }'
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        users { id }
      }"
    `)
  })

  test('$directives', () => {
    expect(
      generateGraphQL({
        query: {
          countries: {
            code: true,
            name: {
              $args: {
                lang: 'zh'
              },
              $directives: '@skip(if: false)'
            }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        countries {
          code
          name (
            lang: "zh"
          ) @skip(if: false)
        }
      }"
    `)
  })

  test('skip $directives with empty name', () => {
    expect(
      generateGraphQL({
        query: {
          countries: {
            code: true,
            name: {
              $args: {
                lang: 'zh'
              },
              $directives: { name: '' }
            }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        countries {
          code
          name (
            lang: "zh"
          )
        }
      }"
    `)
  })

  test('$fragments', () => {
    expect(
      generateGraphQL({
        query: {
          countries: {
            $fragments: [
              {
                inline: {
                  $on: 'Country',
                  $directives: {
                    name: '@skip',
                    args: { if: false }
                  },

                  code: true,
                  name: true
                }
              }
            ]
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        countries {
          ... on Country @skip (
            if: false
          ) {
            code
            name
          }
        }
      }"
    `)
  })

  test('ignore the fields with falsy values', () => {
    expect(
      generateGraphQL({
        query: {
          users: {
            id: true,
            name: false,
            avatar: 0,
            tweets: null,
            friends: {
              id: undefined,
              name: ''
            }
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        users {
          id
          friends
        }
      }"
    `)
  })
})
