export function formatPhoneMask(input: string): string {
  const digits = input.replace(/\D/g, '')
  let national = digits
  if (digits.startsWith('8')) national = `7${digits.slice(1)}`
  else if (digits.startsWith('7')) national = digits
  else if (digits.length > 0) national = `7${digits}`

  const rest = national.slice(1, 11)
  let result = '+7'
  if (rest.length === 0) return result
  result += ` ${rest.slice(0, 3)}`
  if (rest.length <= 3) return result
  result += ` ${rest.slice(3, 6)}`
  if (rest.length <= 6) return result
  result += ` ${rest.slice(6, 8)}`
  if (rest.length <= 8) return result
  return `${result} ${rest.slice(8, 10)}`
}
