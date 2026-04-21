import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen:    boolean
  onClose:   () => void
  title:     string
  children:  ReactNode
  footer?:   ReactNode
  size?:     ModalSize
  /** Ícone exibido no header. Default: '✦' */
  icon?:     string
  /** Cor de fundo do ícone. Default: var(--primary-hl) */
  accentBg?: string
  /** Cor do ícone. Default: var(--primary) */
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
      {/* Backdrop clicável */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="pm-sheet"
        style={{ maxWidth: maxWidths[size] }}
      >
        {/* ── Header ── */}
        <div className="pm-header">
          <div
            className="pm-header-icon"
            style={{ background: accentBg, color: accentFg }}
          >
            {icon}
          </div>
          <div className="pm-header-text">
            <h2 id="modal-title" className="pm-header-title">{title}</h2>
          </div>
          <button
            className="pm-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Body scrollável ── */}
        <div className="pm-body">
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="pm-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
