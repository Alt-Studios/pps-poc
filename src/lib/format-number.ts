export function formatCurrency(value: number, decimals = 1, prefix = 'R'): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `${prefix}${(value / 1_000_000_000).toFixed(decimals)}B`
  if (abs >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(decimals)}M`
  if (abs >= 1_000) return `${prefix}${(value / 1_000).toFixed(decimals)}K`
  return `${prefix}${value.toFixed(0)}`
}

export function formatWithSpaces(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
