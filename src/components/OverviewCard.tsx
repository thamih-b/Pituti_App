import type { ReactNode } from 'react'
import type { BadgeStatus } from '../types'
import Badge from './Badge'

interface OverviewCardProps {
  title: string
  value: string | number
  description?: string
  status?: BadgeStatus
  statusLabel?: string
  icon?: ReactNode
  onClick?: () => void
}

export default function OverviewCard({
  title, value, description, status, statusLabel, icon, onClick,
}: OverviewCardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl border border-stone-200 bg-white p-5 shadow-sm flex flex-col gap-3',
        interactive ? 'cursor-pointer hover:shadow-md hover:border-teal-300 transition-all duration-150' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-600">{title}</p>
        {icon && <span className="text-stone-400">{icon}</span>}
      </div>

      <p className="text-3xl font-bold tabular-nums text-stone-900">{value}</p>

      {description && <p className="text-xs text-stone-500">{description}</p>}

      {status && statusLabel && (
        <Badge label={statusLabel} status={status} />
      )}
    </div>
  )
}
