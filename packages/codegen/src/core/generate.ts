import fs from 'fs'
import path from 'path'
import { convertSchemaFile } from './convertSchemaFile'
import type { ConfigurationFile, SchemaFile } from '../types/options'

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
  config: ConfigurationFile,
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

  let index = 0
  let success = 0

  const next = async () => {
    if (index < files.length) {
      const file: SchemaFile = { ...files[index] }

      let name = ''

      if (file.filename) {
        file.filename = path.resolve(configAbsDir, file.filename)
        name = path.relative(cwd, file.filename)
      } else if (file.endpoint?.url) {
        name = file.endpoint.url

        if (file.endpoint.headersFile) {
          file.endpoint.headersFile = path.resolve(
            configAbsDir,
            file.endpoint.headersFile
          )
        }
      }

      if (file.skip) {
        log(`skipped: ${name || 'nil'}`)
      } else if (name) {
        log(`processing: ${name}`)
        try {
          const startedAt = Date.now()
          const result = await convertSchemaFile(file, config.options)

          if (result) {
            if (file.output) {
              const outputPath = path.resolve(configAbsDir, file.output)
              const outputDir = path.dirname(outputPath)

              ensureDirSync(outputDir)
              fs.writeFileSync(outputPath, result.code)
              success += 1

              let scalarWarning = ''

              const { unmappedScalars } = result.ctx

              if (unmappedScalars.length === 1) {
                scalarWarning =
                  `Warning:\nThe scalar type ${unmappedScalars[0]} is mapped to \`unknown\`. ` +
                  '\nYou can use the `scalarTypes` option to specify the type.'
              } else if (unmappedScalars.length > 1) {
                const types = unmappedScalars.join(', ')
                scalarWarning =
                  `Warning:\nThe scalar types ${types} are mapped to \`unknown\`. ` +
                  '\nYou can use the `scalarTypes` option to specify the types.'
              }

              if (scalarWarning) {
                const exampleScalarTypes: Record<string, string> = {}
                unmappedScalars.forEach((typeName) => {
                  exampleScalarTypes[typeName] = 'unknown'
                })
                const example = JSON.stringify(exampleScalarTypes, null, 2)
                log(
                  scalarWarning +
                    ` Below is an example (you should change "unknown" to the correct type):\n${example}`
                )
              }

              log(
                `generated: ${path.relative(cwd, outputPath)} (${
                  Date.now() - startedAt
                }ms)`
              )
            } else {
              logError(`error: the output of ${name} is not set`)
            }
          }
        } catch (err) {
          logError(`error: failed processing ${name}`)
          logError(err as Error)
        }
      } else {
        logError(`error: neither filename nor endpoint set for files[${index}]`)
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
