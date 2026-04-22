

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen:    boolean
  onClose:   () => void
  /** Main label shown in the hero header */
  title:     string
  /** Subtitle / context line below the title */
  subtitle?: string
  children:  ReactNode
  footer?:   ReactNode
  size?:     ModalSize
  /** Emoji or text icon shown in the colored circle */
  icon?:     string
  /** Background colour of the icon circle — also used as header gradient start */
  accentBg?: string
  /** Icon foreground colour */
  accentFg?: string
}

const maxWidths: Record<ModalSize, string> = {
  sm: '400px',
  md: '520px',
  lg: '680px',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size     = 'md',
  icon     = '✦',
  accentBg = 'var(--primary-hl)',
  accentFg = 'var(--primary)',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handler)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="pm-overlay"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="pm-sheet" style={{ maxWidth: maxWidths[size] }}>

        {/* ── Single hero header — no duplication ── */}
{title && (
  <div
    className="pm-hero-header"
    style={{ background: `linear-gradient(135deg, ${accentBg} 0%, var(--surface) 100%)` }}
  >
    <div className="pm-hero-icon" style={{ background: accentFg, color: '#fff' }}>
      {icon}
    </div>
    <div className="pm-hero-text">
      <h2 id="modal-title" className="pm-hero-title">{title}</h2>
      {subtitle && <p className="pm-hero-subtitle">{subtitle}</p>}
    </div>
    <button className="pm-close" onClick={onClose} aria-label="Cerrar modal">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>
)}

        {/* ── Scrollable body ── */}
        <div className="pm-body">
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="pm-footer pm-footer--right">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
