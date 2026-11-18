import { approxUsd, formatFcfa } from '@/lib/money'

/** "380,000 FCFA (about $660)": the dollar figure uses the rate in Site settings. */
export function Money({ amount, rate }: { amount: number; rate?: number | null }) {
  const usd = approxUsd(amount, rate)
  return (
    <>
      {formatFcfa(amount)}
      {usd ? <span className="font-normal text-body"> ({usd})</span> : null}
    </>
  )
}
