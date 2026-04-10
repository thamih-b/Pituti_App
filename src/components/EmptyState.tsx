import type { ReactNode } from 'react'
import Button from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

const DefaultIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9h.01M15 9h.01M9 15s1 2 3 2 3-2 3-2" strokeLinecap="round" />
  </svg>
)

export default function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
      <span className="text-stone-400">{icon ?? <DefaultIcon />}</span>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-stone-800">{title}</h3>
        {description && <p className="max-w-xs text-sm text-stone-500">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
