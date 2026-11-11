import Image from 'next/image'

import { asMedia } from '@/lib/payload'

type Props = { image: unknown; variant: 'colour' | 'white'; className?: string }

/** The uploaded logo, or a text wordmark until one is uploaded in Site settings. */
export function Logo({ image, variant, className }: Props) {
  const media = asMedia(image)
  if (media?.url) {
    return (
      <Image
        src={media.url}
        alt="7FOR1 Foundation"
        width={media.width ?? 368}
        height={media.height ?? 110}
        className={className}
        priority={variant === 'colour'}
      />
    )
  }
  const colour = variant === 'white' ? 'text-white' : 'text-brand-500'
  return (
    <span className={`inline-flex flex-col leading-none font-black tracking-tight ${colour} ${className ?? ''}`}>
      <span className="text-2xl">7FOR1</span>
      <span className="text-[0.7rem] tracking-[0.2em]">FOUNDATION</span>
    </span>
  )
}
