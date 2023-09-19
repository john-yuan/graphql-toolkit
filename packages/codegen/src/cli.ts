import fs from 'fs'
import { resolveCliArgs } from 'resolve-cli-args'
import { generate } from './core/generate'
import type { ConfigurationFile } from './types/options'

const { args } = resolveCliArgs(process.argv.slice(2))

if (args['--help'] || args['-h'] || Object.keys(args).length === 0) {
  console.log('Example:')
  console.log('  npx @mygql/codegen --config config.json')
  console.log('')
  console.log('Command:')
  console.log('  npx @mygql/codegen --config <config-path>')
  console.log('')
  console.log('Arguments:')
  console.log('  --config Specify the configuration file path.')
  console.log('')
  process.exit()
}

const configPath = (args['--config'] || [])[0]

if (!configPath) {
  console.error('error: config is required')
  console.error('')
  process.exit(1)
}

const json = fs.readFileSync(configPath).toString()
const config = JSON.parse(json) as ConfigurationFile

generate(config, { configPath })
