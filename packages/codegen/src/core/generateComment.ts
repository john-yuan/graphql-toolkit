import { generateIndent } from './generateIndent'

export function generateComment(text: string | null, indent: number) {
  if (!text) {
    return ''
  }

  const code: string[] = []
  const prefix = generateIndent(indent)

  code.push(`${prefix}/**`)
  text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .forEach((line) => {
      code.push(`${prefix} *${line ? ` ${line}` : ''}`)
    })

  code.push(`${prefix} */`)
  return code.join('\n')
}
