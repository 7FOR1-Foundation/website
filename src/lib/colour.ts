/** Small colour helpers so CMS-chosen brand colours stay readable. */

type RGB = [number, number, number]

const toRgb = (hex: string): RGB => {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const toHex = ([r, g, b]: RGB) => `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`

const luminance = (hex: string) => {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Mixes a colour towards another; amount 0 keeps `from`, 1 gives `to`. */
export const mix = (from: string, to: string, amount: number) => {
  const a = toRgb(from)
  const b = toRgb(to)
  return toHex([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * amount) as RGB)
}

/**
 * Darkens a colour just enough for `text` on top of it (or it as text on
 * `text`) to reach the WCAG ratio, 4.5:1 for normal-size text by default.
 */
export const readableOn = (colour: string, text = '#ffffff', ratio = 4.5) => {
  let shade = colour
  for (let step = 0; step < 20 && contrast(shade, text) < ratio; step++) shade = mix(shade, '#000000', 0.05)
  return shade
}

export const isHex = (value?: string | null): value is string => Boolean(value && /^#[0-9a-f]{6}$/i.test(value))
