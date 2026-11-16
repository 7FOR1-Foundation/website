import type { ReactNode } from 'react'

import { type ValueIconName, valueIcons } from '@/fields/valueIcons'

const drawings: Record<ValueIconName, ReactNode> = {
  action: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  equality: (
    <>
      <path d="M12 3v18M8 21h8M4 7h16" />
      <path d="m6 7-3 6a3 3 0 0 0 6 0L6 7ZM18 7l-3 6a3 3 0 0 0 6 0l-3-6Z" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="m5 8.5 7 1.5 7-1.5M12 10v5M12 15l-3.5 6M12 15l3.5 6" />
    </>
  ),
  growth: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c0-4-3-7-7-7 0 4 3 7 7 7ZM12 14c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" />
      <path d="M8 21h8" />
    </>
  ),
  accountability: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 2.5h6v3H9zM9 13l2 2 4-4" />
    </>
  ),
  partnership: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15.5 14.4c.5-.3 1-.4 1.5-.4 2.8 0 5 2.2 5 5" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  idea: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  learning: (
    <>
      <path d="M12 6.5C10.3 5 7.8 4.5 4 4.5v14c3.8 0 6.3.5 8 2 1.7-1.5 4.2-2 8-2v-14c-3.8 0-6.3.5-8 2Z" />
      <path d="M12 6.5v14" />
    </>
  ),
}

export const isValueIcon = (name: unknown): name is ValueIconName =>
  typeof name === 'string' && Object.hasOwn(valueIcons, name)

export const valueIconColour = (name: ValueIconName) => valueIcons[name].colour

/** A white icon in a coloured circle. Decorative: the value's title says what it means. */
export function ValueIcon({ name }: { name: ValueIconName }) {
  return (
    <span
      className="flex size-14 items-center justify-center rounded-full text-white"
      style={{ backgroundColor: valueIcons[name].colour }}
      aria-hidden="true"
    >
      <svg
        width={28}
        height={28}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable={false}
      >
        {drawings[name]}
      </svg>
    </span>
  )
}
