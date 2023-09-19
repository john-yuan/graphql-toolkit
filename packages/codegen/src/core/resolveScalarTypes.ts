import type { Options } from '../types/options'

export function resolveScalarTypes(scalarTypes?: Options['scalarTypes']) {
  const result: [string, string][] = []

  if (scalarTypes) {
    if (Array.isArray(scalarTypes)) {
      scalarTypes.forEach((el) => result.push(el))
    } else {
      Object.entries(scalarTypes).forEach((el) => result.push(el))
    }
  }

  return result
}
