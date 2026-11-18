/** Money shown on the site: amounts are stored in FCFA, with an approximate US dollar figure for visitors abroad. */
export const formatFcfa = (amount: number) => `${amount.toLocaleString('en-US')} FCFA`

/** "about $660": rounded to two significant figures, since the rate changes. */
export const approxUsd = (amount: number, fcfaPerUsd?: number | null) => {
  if (!fcfaPerUsd || amount <= 0) return null
  const usd = amount / fcfaPerUsd
  const step = usd < 100 ? 5 : 10 ** (Math.floor(Math.log10(usd)) - 1)
  return `about $${(Math.round(usd / step) * step).toLocaleString('en-US')}`
}
