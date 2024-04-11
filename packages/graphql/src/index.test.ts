import { generateQuery } from '.'

describe('operation type', () => {
  test('query', () => {
    expect(
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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

  test('keep field name when sub field is empty', () => {
    expect(
      generateQuery({
        query: {
          countries: {
            code: 1,
            name: [
              {},
              {
                $alias: 'name_zh',
                $args: { lang: 'zh' }
              }
            ]
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        countries {
          code
          name
          name_zh: name (
            lang: "zh"
          )
        }
      }"
    `)
  })

  test('sub fields', () => {
    expect(
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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

  test('$directives multiple', () => {
    expect(
      generateQuery({
        query: {
          testDirectives: {
            $directives: [
              '@test_one',
              {
                name: '@test_two'
              },
              {
                name: '@test_three',
                args: {
                  arg1: 'value',
                  arg2: {
                    arg3: 3,
                    arg4: 'four'
                  }
                }
              }
            ],

            id: true
          }
        }
      })
    ).toMatchInlineSnapshot(`
      "query {
        testDirectives @test_one @test_two @test_three (
          arg1: "value"
          arg2: {
            arg3: 3
            arg4: "four"
          }
        ) {
          id
        }
      }"
    `)
  })

  test('skip $directives with empty name', () => {
    expect(
      generateQuery({
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
      generateQuery({
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
      generateQuery({
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

describe('options', () => {
  test('custom indent level an char', () => {
    expect(
      generateQuery(
        {
          query: {
            testIndent: {
              $args: {
                numberValue: 1,
                nullValue: null,
                booleanValue: false,
                emptyStringValue: '',
                stringValue: 'hello',
                objectValue: {
                  type: 'object'
                },
                arrayValue: [
                  1,
                  true,
                  null,
                  {
                    mode: { $enum: 'TEST' },
                    code: { $var: '$code' }
                  },
                  {},
                  { $keep: true },
                  undefined,
                  { $raw: '' },
                  { $raw: '{}' },
                  { $raw: undefined }
                ]
              },

              id: true,
              name: 1,
              object: {
                type: true,
                mode: 1
              }
            }
          }
        },
        { indent: 3, indentChar: '\t' }
      )
    ).toMatchInlineSnapshot(`
      "			query {
      				testIndent (
      					numberValue: 1
      					nullValue: null
      					booleanValue: false
      					emptyStringValue: ""
      					stringValue: "hello"
      					objectValue: {
      						type: "object"
      					}
      					arrayValue: [1, true, null, {
      						mode: TEST
      						code: $code
      					}, {}, {}]
      				) {
      					id
      					name
      					object {
      						type
      						mode
      					}
      				}
      			}"
    `)
  })
})
