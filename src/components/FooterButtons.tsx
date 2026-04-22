import type { ReactNode, ButtonHTMLAttributes } from 'react'

type PfVariant =
  | 'close' | 'cancel'
  | 'save' | 'primary'
  | 'register' | 'add'
  | 'done'
  | 'edit'
  | 'archive'
  | 'resolve'
  | 'delete' | 'danger'
  | 'warn'

type PfSize = 'sm' | 'md' | 'lg'

interface PfBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant:  PfVariant
  size?:    PfSize
  icon?:    ReactNode
  full?:    boolean
  loading?: boolean
  children: ReactNode
}

// ── SVG Icon helpers ──────────────────────────────────────────
function SaveIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }
function CloseIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg> }
function EditIcon()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg> }
function CheckIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> }
function AddIcon()      { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg> }
function TrashIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> }
function ArchiveIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg> }
function SpinIcon()     { return <span style={{ display:'inline-block', width:14, height:14, borderRadius:'50%', border:'2.5px solid currentColor', borderTopColor:'transparent', animation:'spin .7s linear infinite' }}/> }

const DEFAULT_ICONS: Partial<Record<PfVariant, ReactNode>> = {
  save:     <SaveIcon/>,
  primary:  <SaveIcon/>,
  close:    <CloseIcon/>,
  cancel:   <CloseIcon/>,
  edit:     <EditIcon/>,
  done:     <CheckIcon/>,
  register: <CheckIcon/>,
  add:      <AddIcon/>,
  resolve:  <CheckIcon/>,
  delete:   <TrashIcon/>,
  danger:   <TrashIcon/>,
  archive:  <ArchiveIcon/>,
}

/**
 * PfBtn — Professional Footer Button
 * Uses .pf-btn CSS system for consistent appearance across all modals and forms.
 */
export function PfBtn({
  variant,
  size = 'md',
  icon,
  full = false,
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}: PfBtnProps) {
  const classes = [
    'pf-btn',
    `pf-btn--${variant}`,
    size !== 'md' ? `pf-btn--${size}` : '',
    full ? 'pf-btn--full' : '',
    className,
  ].filter(Boolean).join(' ')

  const displayIcon = icon ?? DEFAULT_ICONS[variant]

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? <SpinIcon/> : (displayIcon && <span className="pf-btn-icon">{displayIcon}</span>)}
      {children}
    </button>
  )
}

/**
 * PfFooter — Professional Footer container
 * place=start puts destructive action on left, actions on right (default pattern)
 */
interface PfFooterProps {
  left?:  ReactNode
  right?: ReactNode
  children?: ReactNode
  className?: string
}
export function PfFooter({ left, right, children, className = '' }: PfFooterProps) {
  if (children) {
    return (
      <div className={`pf-footer ${className}`}>
        {children}
      </div>
    )
  }
  return (
    <div className={`pf-footer pf-footer--spread ${className}`}>
      {left  && <div className="pf-footer__left">{left}</div>}
      {right && <div className="pf-footer__right">{right}</div>}
    </div>
  )
}

/** Preset footer: Cancel + Primary CTA */
export function FooterCancelSave({
  onCancel,
  onSave,
  cancelLabel = 'Cancelar',
  saveLabel   = 'Guardar cambios',
  loading     = false,
  variant     = 'save',
}: {
  onCancel:     () => void
  onSave?:      () => void
  cancelLabel?: string
  saveLabel?:   string
  loading?:     boolean
  variant?:     PfVariant
}) {
  return (
    <PfFooter>
      <PfBtn variant="cancel" onClick={onCancel}>{cancelLabel}</PfBtn>
      {onSave
        ? <PfBtn variant={variant} onClick={onSave} loading={loading}>{saveLabel}</PfBtn>
        : <PfBtn variant={variant} type="submit" loading={loading}>{saveLabel}</PfBtn>}
    </PfFooter>
  )
}

/** Preset: Cancel + Edit + Done */
export function FooterDetailActions({
  onClose,
  onEdit,
  onDone,
  doneLabel = 'Marcar hecho',
  doneVariant = 'done',
}: {
  onClose:      () => void
  onEdit:       () => void
  onDone?:      () => void
  doneLabel?:   string
  doneVariant?: PfVariant
}) {
  return (
    <PfFooter>
      <PfBtn variant="cancel" size="sm" onClick={onClose}>Cerrar</PfBtn>
      <div style={{ display:'flex', gap:'.5rem', marginLeft:'auto' }}>
        <PfBtn variant="edit" onClick={onEdit}>Editar</PfBtn>
        {onDone && <PfBtn variant={doneVariant} onClick={onDone}>{doneLabel}</PfBtn>}
      </div>
    </PfFooter>
  )
}
