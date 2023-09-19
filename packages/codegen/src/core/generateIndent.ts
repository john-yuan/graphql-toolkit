export function generateIndent(size: number) {
  const code: string[] = []

  for (let i = 0; i < size; i += 1) {
    code.push('  ')
  }

  return code.join('')
}
