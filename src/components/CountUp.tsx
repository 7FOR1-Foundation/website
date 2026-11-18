'use client'

import { useEffect, useRef } from 'react'

const DURATION_MS = 1600

/** Splits "$2,000+" into "$", 2000 and "+", remembering commas and decimals. */
const parse = (value: string) => {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, digits, suffix] = match
  return {
    prefix,
    suffix,
    target: Number(digits.replace(/,/g, '')),
    decimals: digits.split('.')[1]?.length ?? 0,
    grouped: digits.includes(','),
  }
}

/**
 * A figure such as "18+" or "$2,000+" that counts up from zero the first time it
 * scrolls into view. The page is built with the final figure, so it shows
 * correctly without JavaScript; screen readers always get the final figure;
 * and people who prefer reduced motion see it without animation.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    const parsed = parse(value)
    if (!element || !parsed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const format = (n: number) =>
      parsed.prefix +
      n.toLocaleString('en-US', {
        minimumFractionDigits: parsed.decimals,
        maximumFractionDigits: parsed.decimals,
        useGrouping: parsed.grouped,
      }) +
      parsed.suffix

    let frame = 0
    const run = () => {
      const start = performance.now()
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS)
        const eased = 1 - (1 - progress) ** 3 // fast start, gentle finish
        element.textContent = format(parsed.target * eased)
        if (progress < 1) frame = requestAnimationFrame(step)
        else element.textContent = value
      }
      frame = requestAnimationFrame(step)
    }

    element.textContent = format(0)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          run()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      element.textContent = value
    }
  }, [value])

  return (
    // The hidden final figure keeps the width steady while the visible one counts.
    <span className="inline-grid tabular-nums">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span ref={ref} aria-hidden="true" className="col-start-1 row-start-1">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
