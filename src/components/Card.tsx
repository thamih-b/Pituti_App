import type { ReactNode } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  padding?: CardPadding
  onClick?: () => void
  className?: string
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
}

export default function Card({ children, padding = 'md', onClick, className = '' }: CardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl border border-stone-200 bg-white shadow-sm',
        interactive ? 'cursor-pointer hover:shadow-md hover:border-teal-300 transition-all duration-150' : '',
        paddingClasses[padding],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
