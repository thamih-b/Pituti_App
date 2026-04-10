import type { BadgeStatus } from '../types'

interface BadgeProps {
  label: string
  status?: BadgeStatus
  className?: string
}

const statusClasses: Record<BadgeStatus, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-800',
  neutral: 'bg-stone-100 text-stone-600',
}

export default function Badge({ label, status = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusClasses[status],
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
