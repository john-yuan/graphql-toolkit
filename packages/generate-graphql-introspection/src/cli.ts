import path from 'path'
import { resolveCliArgs } from 'resolve-cli-args'
import { generateGraphQLIntrospection } from './index'
import type { Options } from './index'

const { args } = resolveCliArgs(process.argv.slice(2))

if (args['--help'] || args['-h'] || Object.keys(args).length === 0) {
  console.log(
    [
      '',
      'Usage:',
      '  # All .graphql files in the graphql directory',
      '  generate-graphql-introspection -s "graphql/*.graphql" -o introspection.json',
      '',
      '  # Specify one file',
      '  generate-graphql-introspection -s graphql/schema.graphql -o introspection.json',
      '',
      '  # Specify multiple files',
      '  generate-graphql-introspection -s graphql/user.graphql -s graphql/order.graphql -o introspection.json',
      '',
      'Options:',
      '  -s --source    Specify the source glob.',
      '  -i --ignore    Specify the rule to ignore files in source.',
      '  -o --output    Specify the output file.',
      '  -h --help      Print help message.',
      ''
    ].join('\n')
  )

  process.exit(0)
}

function log(msg: string) {
  console.log(`[${new Date().toLocaleString()}] ` + msg)
}

const cwd = process.cwd()
const options: Options = {
  source: [...(args['--source'] || []), ...(args['-s'] || [])]
    .map((v) => v.trim())
    .filter((v) => v),
  output: (args['--output'] || args['-o'] || [])[0] || '',
  ignore: (args['--ignore'] || args['-i'] || [])
    .map((v) => v.trim())
    .filter((v) => v),
  log
}

try {
  log('Resolving: ' + options.source.join(', '))
  generateGraphQLIntrospection(options)
  log('Generated: ' + path.relative(cwd, options.output))
} catch (err) {
  const e = err as Error

  try {
    console.error()
    console.error(e.message)
    console.error()
    console.error(e.stack)
  } catch (ignore) {
    throw err
  }
}
