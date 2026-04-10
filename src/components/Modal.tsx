import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={['relative w-full rounded-2xl bg-white shadow-xl', sizeClasses[size]].join(' ')}>
        <header className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-stone-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} ariaLabel="Cerrar modal">✕</Button>
        </header>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-stone-200 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  )
}
