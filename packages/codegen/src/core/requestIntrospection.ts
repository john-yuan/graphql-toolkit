import type { Introspection } from '../types/introspection'

import http from 'http'
import https from 'https'

function request<T = any>(
  url: string,
  options?: {
    headers?: Record<string, string>
    json?: any
  }
) {
  return new Promise<T>((resolve, reject) => {
    const requestURL = new URL(url)
    const content = options?.json ? JSON.stringify(options.json) : ''
    const client = requestURL.protocol.toLowerCase().startsWith('https')
      ? https
      : http

    let finished = false

    const finish = (err: Error | null, result: any) => {
      if (!finished) {
        finished = true
        if (err == null) {
          resolve(result)
        } else {
          reject(err)
        }
      }
    }

    const req = client.request(
      requestURL,
      {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
          'Content-Length': Buffer.byteLength(content)
        }
      },
      (res) => {
        let data = ''

        res.setEncoding('utf-8')

        res.on('error', (err) => {
          finish(err, null)
        })

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          try {
            finish(null, JSON.parse(data))
          } catch (err) {
            finish(err as Error, null)
          }
        })
      }
    )

    req.on('error', (err) => {
      finish(err, null)
    })

    req.write(content, 'utf-8')
    req.end()
  })
}

export async function requestIntrospection(
  url: string,
  headers?: Record<string, string>
) {
  return await request<Introspection & { errors?: any[] }>(url, {
    headers,
    json: {
      query: `
        query IntrospectionQuery {
          __schema {
            queryType {
              name
            }
            mutationType {
              name
            }
            subscriptionType {
              name
            }
            types {
              ...FullType
            }
            directives {
              name
              description
              locations
              args {
                ...InputValue
              }
            }
          }
        }

        fragment FullType on __Type {
          kind
          name
          description
          fields(includeDeprecated: true) {
            name
            description
            args {
              ...InputValue
            }
            type {
              ...TypeRef
            }
            isDeprecated
            deprecationReason
          }
          inputFields {
            ...InputValue
          }
          interfaces {
            ...TypeRef
          }
          enumValues(includeDeprecated: true) {
            name
            description
            isDeprecated
            deprecationReason
          }
          possibleTypes {
            ...TypeRef
          }
        }

        fragment InputValue on __InputValue {
          name
          description
          type {
            ...TypeRef
          }
          defaultValue
        }

        fragment TypeRef on __Type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    }
  }).then((res) => {
    if (res.errors && !res.data) {
      throw new Error(
        `${res.errors[0].message || 'failed fetching introspection'}`
      )
    } else {
      return res as Introspection
    }
  })
}
