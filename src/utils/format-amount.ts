// turns 10000000 into 10 000 000

export const formatAmount = (number?: any) => {
  if (number === undefined || number === '' || number === null) return ''

  const num = Number(number)

  return isNaN(num) ? '' : new Intl.NumberFormat('ru-RU').format(number)
}
