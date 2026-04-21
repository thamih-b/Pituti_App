import { useState } from 'react'
import Button from './Button'

export interface CareDetailItem {
  id: string; petId: string; emoji: string; title: string; sub: string
  total: number; done: number; done_state: boolean; bg: string
}

interface Props {
  item:     CareDetailItem | null
  onClose:  () => void
  onToggle: (id: string, newDone: number, newState: boolean) => void
  onEdit:   (item: CareDetailItem) => void
}

export default function CareDetailModal({ item, onClose, onToggle, onEdit }: Props) {
  const [localDone, setLocalDone] = useState<number | null>(null)

  if (!item) return null

  const done  = localDone !== null ? localDone : item.done
  const isDone = done >= item.total

  const clickDot = (i: number) => {
    // toggle: clicking filled dot un-fills from that point, clicking empty fills up to that point
    const newDone = i < done ? i : i + 1
    setLocalDone(newDone)
    onToggle(item.id, newDone, newDone >= item.total)
  }

  const handleMarkDone = () => {
    const newDone = isDone ? 0 : item.total
    setLocalDone(newDone)
    onToggle(item.id, newDone, newDone >= item.total)
  }

  const handleEdit = () => { onEdit(item); onClose() }

  return (
    <div className="care-detail-overlay" onClick={onClose}>
      <div className="care-detail-sheet" onClick={e => e.stopPropagation()}>

        {/* Hero */}
        <div className="care-detail-hero">
          <div className="care-detail-emoji" style={{ background: item.bg }}>{item.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{item.title}</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>{item.sub}</div>
          </div>
          <button
            style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'var(--surface-offset)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}
            onClick={onClose}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="care-detail-body">

          {/* Progress */}
          <div className="care-detail-progress-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '.5rem' }}>
                Progreso de hoy — {done} de {item.total}
              </div>
              <div className="care-detail-dots">
                {Array.from({ length: item.total }).map((_, i) => (
                  <button
                    key={i}
                    className={['care-detail-dot-btn', i < done ? 'filled' : ''].join(' ')}
                    onClick={() => clickDot(i)}
                    title={i < done ? 'Marcar como pendiente' : 'Marcar como hecho'}
                  >
                    {i < done ? '✓' : '○'}
                  </button>
                ))}
              </div>
            </div>
            {isDone && (
              <div style={{ background: 'var(--success-hl)', border: '1.5px solid var(--success)', borderRadius: 'var(--r-full)', padding: '.25rem .75rem', fontSize: '.75rem', fontWeight: 800, color: 'var(--success)', flexShrink: 0 }}>
                Completado ✓
              </div>
            )}
          </div>

          {/* Meta info */}
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--surface-offset)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '.5rem .875rem', flex: 1 }}>
              <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em' }}>Frecuencia</div>
              <div style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--text)', marginTop: '.2rem' }}>{item.sub}</div>
            </div>
            <div style={{ background: 'var(--surface-offset)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '.5rem .875rem', flex: 1 }}>
              <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em' }}>Estado</div>
              <div style={{ fontSize: '.875rem', fontWeight: 700, color: isDone ? 'var(--success)' : 'var(--warn)', marginTop: '.2rem' }}>
                {isDone ? 'Completado' : 'Pendiente'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="care-detail-footer">
          <Button variant="secondary" onClick={handleEdit} style={{ flex: 1 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar
          </Button>
          <Button
            onClick={handleMarkDone}
            style={{ flex: 1, background: isDone ? 'var(--warn)' : 'var(--success)', minWidth: 0 }}
          >
            {isDone ? '↩ Desmarcar' : '✓ Marcar hecho'}
          </Button>
        </div>
      </div>
    </div>
  )
}
