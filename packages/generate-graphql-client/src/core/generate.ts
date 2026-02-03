import type { Configuration, Endpoint, Options, SchemaFile } from './types'

import fs from 'fs'
import path from 'path'
import { convertSchemaFile } from './convertSchemaFile'

export interface GenerateOptions {
  /**
   * Specify the current working directory. Default: `process.cwd()`.
   */
  cwd?: string

  /**
   * Specify the config path. This path will be used to resolve the paths
   * in the config. Default: `cwd`.
   */
  configPath?: string

  /**
   * Whether to disable the logger.
   */
  disableLogger?: boolean

  /**
   * Custom log function. Default: `console.log`.
   */
  log?: (msg: string) => void

  /**
   * Custom log error function. Default: `console.error`.
   */
  logError?: (msg: string | Error) => void

  /**
   * Specify a function to format the log message.
   * The default one will prepend the current time to the message.
   */
  formatMessage?: (msg: string) => string
}

export async function generate(
  config: Configuration,
  options?: GenerateOptions
) {
  const opts = options || {}
  const files = config.files || []

  const formatMsg = (msg: string) => {
    if (opts.formatMessage) {
      return opts.formatMessage(msg)
    }
    return msg ? `[${new Date().toLocaleString()}] ${msg}` : msg
  }

  const log = (msg: string) => {
    if (!opts.disableLogger) {
      if (opts.log) {
        opts.log(formatMsg(msg))
      } else {
        console.log(formatMsg(msg))
      }
    }
  }

  const logError = (msg: string | Error) => {
    if (!opts.disableLogger) {
      if (typeof msg === 'string') {
        if (opts.logError) {
          opts.logError(formatMsg(msg))
        } else {
          console.log(formatMsg(msg))
        }
      } else {
        if (opts.logError) {
          opts.logError(msg)
        } else {
          console.error(msg)
        }
      }
    }
  }

  const ensureDirSync = (dir: string) => {
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 })
  }

  if (!files.length) {
    logError('warning: no input files')
    return
  }

  const cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd()
  const configAbsDir = opts.configPath
    ? path.dirname(path.resolve(cwd, opts.configPath))
    : cwd

  const globalOptions = config.options || {}

  let index = 0
  let success = 0

  const mergeGlobalOptions = (file: SchemaFile) => {
    const options: Options = { ...file.options }

    const mergeOption = (key: keyof Options) => {
      if (options[key] == null && globalOptions) {
        options[key] = globalOptions[key] as any
      }
    }

    mergeOption('indent')
    mergeOption('headers')
    mergeOption('beautify')
    mergeOption('disableEslint')
    mergeOption('skipGeneratedMessage')
    mergeOption('skipWrappingEnum')
    mergeOption('skipFactory')
    mergeOption('skipMutations')
    mergeOption('skipQueries')
    mergeOption('skipArgsVar')
    mergeOption('markTypenameAsRequired')

    if (!file.skipGlobalScalarTypes) {
      options.scalarTypes = {
        ...globalOptions.scalarTypes,
        ...options.scalarTypes
      }
    }

    if (!file.skipGlobalRenameTypes) {
      options.renameTypes = {
        ...globalOptions.renameTypes,
        ...options.renameTypes
      }
    }

    return options
  }

  const convert = async (file: SchemaFile) => {
    const ctx = await convertSchemaFile(file, mergeGlobalOptions(file))
    const outputPath = path.resolve(configAbsDir, file.output)
    const outputDir = path.dirname(outputPath)

    ensureDirSync(outputDir)
    fs.writeFileSync(outputPath, ctx.getCode())

    let scalarWarning = ''

    if (ctx.unmappedScalars.length === 1) {
      scalarWarning =
        `warning:\n\nThe scalar type ${ctx.unmappedScalars[0]} is ` +
        `mapped to \`unknown\`. ` +
        '\nYou can use the `scalarTypes` option to specify the correct type.'
    } else if (ctx.unmappedScalars.length > 1) {
      const types = ctx.unmappedScalars.join(', ')
      scalarWarning =
        `warning:\n\nThe scalar types ${types} are mapped to \`unknown\`. ` +
        '\nYou can use the `scalarTypes` option to specify the correct types.'
    }

    if (scalarWarning) {
      const exampleScalarTypes: Record<string, string> = {}
      ctx.unmappedScalars.forEach((typeName) => {
        exampleScalarTypes[typeName] = 'unknown'
      })
      const example = JSON.stringify(exampleScalarTypes, null, 2)
      log(
        scalarWarning +
          `\nBelow is an example (you should change` +
          ` "unknown" to the correct type):\n\n${example}\n`
      )
    }

    return path.relative(cwd, outputPath)
  }

  const next = async () => {
    if (index < files.length) {
      const file: SchemaFile = { ...files[index] }

      let name: string | null = null

      if (file.endpoint) {
        const endpoint: Endpoint =
          typeof file.endpoint === 'string'
            ? { url: file.endpoint }
            : { ...file.endpoint }

        name = endpoint.url

        if (endpoint.headersFile) {
          endpoint.headersFile = path.resolve(
            configAbsDir,
            endpoint.headersFile
          )
        }

        file.endpoint = endpoint
      } else if (file.filename) {
        file.filename = path.resolve(configAbsDir, file.filename)
        name = path.relative(cwd, file.filename)
      } else {
        logError(
          `error: the endpoint or filename is not set for ` +
            `the schema file at index ${index}`
        )
      }

      if (name != null) {
        if (!file.output) {
          logError(`error: this file is skipped for its output is not set.`)
        } else if (file.skip) {
          log(`skipped: ${name}`)
        } else {
          try {
            log(`processing: ${name}`)

            const startedAt = Date.now()
            const outputPath = await convert(file)
            const timeUsed = Date.now() - startedAt
            const shortPath = path.relative(cwd, outputPath)

            log(`generated: ${shortPath} (${timeUsed}ms)`)
            success += 1
          } catch (err) {
            logError(`error: failed processing ${name}`)
            logError(err as Error)
          }
        }
      }

      index += 1
      await next()
    }
  }

  await next()

  if (success > 1) {
    log(`finished: ${success} files generated.`)
  } else {
    log(`finished: ${success} file generated.`)
  }
}
