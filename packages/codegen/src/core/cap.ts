export function cap(str?: string) {
  return str ? str.replace(/(^.)/, (v) => (v || '').toUpperCase()) : ''
}
