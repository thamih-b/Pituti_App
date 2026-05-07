// traduzido e sem mock
import { useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface FormDateFieldProps {
  label:        ReactNode
  value:        string
  onChange:     (val: string) => void
  min?:         string
  max?:         string
  required?:    boolean
  hint?:        string
  error?:       string
  placeholder?: string
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function useFormatDate() {
  const { i18n } = useTranslation()
  return (val: string): string => {
    if (!val) return ''
    const d = new Date(val + 'T00:00:00')
    if (isNaN(d.getTime())) return val
    return d.toLocaleDateString(i18n.language, {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }
}

export default function FormDateField({
  label, value, onChange, min, max, required, hint, error, placeholder,
}: FormDateFieldProps) {
  const { t }     = useTranslation()
  const inputRef  = useRef<HTMLInputElement>(null)
  const formatDate = useFormatDate()

  const ph = placeholder ?? t('formDate.placeholder')

  const trigger = () => {
    try { inputRef.current?.showPicker?.() }
    catch { inputRef.current?.click() }
  }

  return (
    <div className="fdf-wrap">
      <label className="fdf-label">
        {label}
        {required && <span className="fdf-required">*</span>}
      </label>

      <div
        className={['fdf-row', error ? 'fdf-row--err' : ''].join(' ')}
        onClick={trigger}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && trigger()}
      >
        <span className="fdf-icon"><CalendarIcon /></span>
        <span className={['fdf-display', !value ? 'fdf-placeholder' : ''].join(' ')}>
          {value ? formatDate(value) : ph}
        </span>
        {value && (
          <button
            className="fdf-clear"
            onClick={e => { e.stopPropagation(); onChange('') }}
            title={t('formDate.clear')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={e => onChange(e.target.value)}
          className="fdf-native"
          tabIndex={-1}
        />
      </div>

      {error   && <span className="fdf-msg fdf-msg--err">{error}</span>}
      {!error && hint && <span className="fdf-msg fdf-msg--hint">{hint}</span>}
    </div>
  )
}