const fs = require('fs')
const path = require('path')

const inputFile = path.resolve(__dirname, '../lib/index.js')
const outputFile = path.resolve(__dirname, '../browser/index.js')

const code = fs.readFileSync(inputFile).toString()
const keyword = 'exports.generateQuery = ('
const index = code.indexOf(keyword)

if (index === -1) {
  throw new Error(`The keyword ${keyword} is not found.`)
}

const output =
  'window.GraphQLToolkit = window.GraphQLToolkit || {};\n' +
  'window.GraphQLToolkit.generateQuery = ' +
  code.substring(index + keyword.length - 1)

fs.mkdirSync(path.resolve(__dirname, '../browser'), { recursive: true })
fs.writeFileSync(outputFile, output)
