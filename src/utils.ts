export function stringify(obj: any): string {
  // Can't use just !obj because of "0" values
  if (obj === null || obj === undefined) {
    return ''
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return JSON.stringify(obj)
  }
  let props = Object.keys(obj)
    .map(key => `${key}: ${stringify(obj[key])}`)
    .join(', ')
  return `{ ${props} }`
}
