import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant, ButtonSize } from '../types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  ariaLabel?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900',
  secondary: 'bg-stone-100 text-stone-900 border border-stone-300 hover:bg-stone-200 active:bg-stone-300',
  ghost:     'bg-transparent text-stone-700 hover:bg-stone-100 active:bg-stone-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  ariaLabel,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
