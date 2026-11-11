import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
})

export const PhoneIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
)

export const MailIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const TargetIcon = ({ size = 48, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 1.6, ...p })}>
    <circle cx="11" cy="13" r="8" />
    <circle cx="11" cy="13" r="4.5" />
    <circle cx="11" cy="13" r="1" />
    <path d="m11 13 7.5-7.5M16 3.5v3h3M18.5 5.5l2-2" />
  </svg>
)

export const BinocularsIcon = ({ size = 48, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 1.6, ...p })}>
    <circle cx="6.5" cy="16.5" r="3.5" />
    <circle cx="17.5" cy="16.5" r="3.5" />
    <path d="M3 16.5 5 6a2 2 0 0 1 4 0v10.5M21 16.5 19 6a2 2 0 0 0-4 0v10.5M9 10h6" />
  </svg>
)

export const PlayIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, { stroke: 'none', ...p })}>
    <circle cx="12" cy="12" r="11" fill="#d92d20" />
    <path d="m10 8 6 4-6 4z" fill="#fff" />
  </svg>
)

export const ArrowUpRightIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const ArrowRightIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const MenuIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
