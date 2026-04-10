import { useId, type ChangeEvent } from 'react'

interface InputProps {
  label: string
  name: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel'
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  disabled = false,
  required = false,
  className = '',
}: InputProps) {
  const id = useId()

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
        {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={[
          'w-full rounded-xl border px-3 py-2 text-sm text-stone-900',
          'placeholder:text-stone-400 focus:outline-none focus:ring-2',
          'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-400 focus:ring-red-500 bg-red-50'
            : 'border-stone-300 focus:ring-teal-600 bg-white',
        ].join(' ')}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">{error}</p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="text-xs text-stone-500">{hint}</p>
      )}
    </div>
  )
}
