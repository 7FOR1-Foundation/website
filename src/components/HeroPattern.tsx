/**
 * Decorative ring of seven figures, drawn after the 7FOR1 logo mark: six filled
 * figures and one outlined, standing slightly apart. Used as the hero background
 * when no hero photo has been uploaded. Purely decorative, so hidden from screen
 * readers.
 */

const FIGURES = 7
const INNER = 62
const OUTER = 150
const HEAD_R = 22
const HEAD_AT = 186
const GAP_DEG = 9
const START_DEG = -90 - 360 / FIGURES / 2 // first figure's left edge, near the top

const rad = (deg: number) => (deg * Math.PI) / 180
const pt = (r: number, deg: number) => `${(r * Math.cos(rad(deg))).toFixed(2)} ${(r * Math.sin(rad(deg))).toFixed(2)}`

const segment = (from: number, to: number) =>
  [
    `M ${pt(INNER, from)}`,
    `L ${pt(OUTER, from)}`,
    `A ${OUTER} ${OUTER} 0 0 1 ${pt(OUTER, to)}`,
    `L ${pt(INNER, to)}`,
    `A ${INNER} ${INNER} 0 0 0 ${pt(INNER, from)}`,
    'Z',
  ].join(' ')

export function HeroPattern({ className }: { className?: string }) {
  const step = 360 / FIGURES
  const figures = Array.from({ length: FIGURES }, (_, i) => {
    const from = START_DEG + i * step + GAP_DEG / 2
    const to = from + step - GAP_DEG
    const mid = (from + to) / 2
    return { i, from, to, mid }
  })
  // The "one": the figure at the upper left, outlined and nudged outwards.
  const ONE = FIGURES - 1

  return (
    <svg viewBox="-260 -260 520 520" className={className} aria-hidden="true" focusable="false">
      {figures.map(({ i, from, to, mid }) => {
        const isOne = i === ONE
        const shift = isOne ? `translate(${pt(26, mid).replace(' ', ',')})` : undefined
        return (
          <g key={i} transform={shift}>
            <path
              d={segment(from, to)}
              fill={isOne ? 'none' : 'currentColor'}
              stroke={isOne ? 'currentColor' : 'none'}
              strokeWidth={isOne ? 7 : 0}
              strokeLinejoin="round"
            />
            <circle
              cx={pt(HEAD_AT, mid).split(' ')[0]}
              cy={pt(HEAD_AT, mid).split(' ')[1]}
              r={HEAD_R}
              fill={isOne ? 'none' : 'currentColor'}
              stroke={isOne ? 'currentColor' : 'none'}
              strokeWidth={isOne ? 7 : 0}
            />
          </g>
        )
      })}
    </svg>
  )
}
