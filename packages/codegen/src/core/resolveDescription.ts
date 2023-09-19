export function resolveDescription(info: {
  description?: string
  isDeprecated?: boolean
  deprecationReason?: string
  defaultValue?: string
}) {
  let desc = ''

  if (info.isDeprecated) {
    desc = '@deprecated'
    if (info.deprecationReason) {
      desc += ' ' + info.deprecationReason.trim()
    }
  }

  const addLine = (line?: string) => {
    const str = line?.trim()
    if (str) {
      if (!desc) {
        desc = str
      } else {
        desc = desc + '\n\n' + str
      }
    }
  }

  addLine(info.description)

  if (info.defaultValue != null) {
    const defaultValue = `${info.defaultValue}` || '""'
    addLine('Default value: `' + defaultValue + '`')
  }

  return desc
}
