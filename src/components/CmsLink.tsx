import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { ArrowUpRightIcon } from './icons'

type Props = Omit<ComponentProps<'a'>, 'href'> & { href?: string | null; children: ReactNode; showIcon?: boolean }

export const isExternal = (href: string) => /^https?:\/\//.test(href)

/** Internal links use Next.js routing; external ones open in a new tab and say so. */
export function CmsLink({ href, children, showIcon = true, ...rest }: Props) {
  if (!href) return null
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        {showIcon ? <ArrowUpRightIcon /> : null}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
