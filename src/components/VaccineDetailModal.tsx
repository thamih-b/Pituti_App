import { useState } from 'react'
import type { VaccineRecord } from '../hooks/usePets'

interface Props {
  vaccine:  (VaccineRecord & { cls: 'ok' | 'soon' | 'late'; petName: string; petEmoji: string }) | null
  onClose:  () => void
  onEdit:   (v: VaccineRecord) => void
  onMarkApplied: (v: VaccineRecord, appliedDate: string, nextDate: string) => void
}

const STATUS_LABEL: Record<string, string> = { ok: 'Al día', soon: 'Por vencer', late: 'Vencida' }
const STATUS_CLASS: Record<string, string> = { ok: 'ok', soon: 'soon', late: 'late' }

export default function VaccineDetailModal({ vaccine, onClose, onEdit, onMarkApplied }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [markMode,   setMarkMode]   = useState(false)
  const [appliedDate, setAppliedDate] = useState(today)
  const [nextDate,   setNextDate]   = useState('')
  const [nextErr,    setNextErr]    = useState('')

  if (!vaccine) return null
  const { cls } = vaccine

  const handleApply = () => {
    if (!nextDate) { setNextErr('Indica la próxima dosis'); return }
    if (nextDate <= appliedDate) { setNextErr('Debe ser posterior a la aplicación'); return }
    onMarkApplied(vaccine, appliedDate, nextDate)
    onClose()
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="detail-header">
          <div className="detail-icon" style={{
            background: cls === 'ok' ? 'var(--success-hl)' : cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
            color:      cls === 'ok' ? 'var(--success)'    : cls === 'soon' ? 'var(--gold)'    : 'var(--err)',
            fontSize: '1.5rem',
          }}>💉</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{vaccine.name}</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
              {vaccine.petEmoji} {vaccine.petName}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="detail-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '1rem' }}>
            <span className={`status-pill ${STATUS_CLASS[cls]}`}>
              {cls === 'ok' ? '✓' : cls === 'soon' ? '⚠' : '✕'} {STATUS_LABEL[cls]}
            </span>
            <span className={`badge ${vaccine.badgeCls}`}>{vaccine.badge}</span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">Última aplicación</div>
              <div className="detail-info-value">{vaccine.applied}</div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">Próxima dosis</div>
              <div className="detail-info-value" style={{ color: cls === 'late' ? 'var(--err)' : cls === 'soon' ? 'var(--warn)' : 'var(--success)' }}>
                {new Date(vaccine.nextDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Mark as applied form */}
          {markMode && (
            <div style={{ background: 'var(--success-hl)', border: '1.5px solid var(--success)', borderRadius: 'var(--r-xl)', padding: '1rem', marginTop: '.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--success)', marginBottom: '.75rem' }}>
                ✓ Registrar aplicación
              </div>
              <div className="detail-date-row">
                <label>Aplicada el</label>
                <input type="date" value={appliedDate}
                  onChange={e => setAppliedDate(e.target.value)}
                  max={today}/>
              </div>
              <div className="detail-date-row">
                <label>Próxima dosis</label>
                <input type="date" value={nextDate}
                  onChange={e => { setNextDate(e.target.value); setNextErr('') }}
                  min={appliedDate}
                  style={{ borderColor: nextErr ? 'var(--err)' : undefined }}/>
              </div>
              {nextErr && <div style={{ fontSize: '.75rem', color: 'var(--err)', fontWeight: 700, marginTop: '.25rem' }}>{nextErr}</div>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="detail-footer">
          {!markMode ? (
            <>
              <button className="btn btn-secondary" onClick={() => { onEdit(vaccine); onClose() }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
                Editar
              </button>
              <button className="btn btn-success" onClick={() => setMarkMode(true)}>
                💉 Marcar aplicada
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-success" onClick={handleApply}>✓ Confirmar aplicación</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
