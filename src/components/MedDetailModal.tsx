import { useState } from 'react'
import type { MedRecord } from './EditMedModal'

interface Props {
  med:     MedRecord | null
  onClose: () => void
  onEdit:  (med: MedRecord) => void
  onMarkAdministered: (med: MedRecord, date: string) => void
}

export default function MedDetailModal({ med, onClose, onEdit, onMarkAdministered }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [markMode,  setMarkMode]  = useState(false)
  const [adminDate, setAdminDate] = useState(today)

  if (!med) return null

  const handleMark = () => {
    onMarkAdministered(med, adminDate)
    onClose()
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div className="detail-icon" style={{ background: med.bg || 'var(--warn-hl)', color: med.color || 'var(--warn)', fontSize: '1.375rem' }}>
            {med.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{med.title}</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
              {med.dose} · {med.frequency}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="detail-body">
          <div style={{ marginBottom: '1rem' }}>
            <span className={`status-pill ${med.archived ? 'archived' : 'ok'}`}>
              {med.archived ? '📁 Archivado' : '✓ Activo'}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-chip">
              <div className="detail-info-label">Dosis</div>
              <div className="detail-info-value">{med.dose}</div>
            </div>
            <div className="detail-info-chip">
              <div className="detail-info-label">Frecuencia</div>
              <div className="detail-info-value">{med.frequency}</div>
            </div>
            {med.startDate && (
              <div className="detail-info-chip">
                <div className="detail-info-label">Inicio</div>
                <div className="detail-info-value">
                  {new Date(med.startDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            )}
            {med.endDate && (
              <div className="detail-info-chip">
                <div className="detail-info-label">Fin</div>
                <div className="detail-info-value">
                  {new Date(med.endDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>

          {med.notes && (
            <div style={{ background: 'var(--surface-offset)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '.75rem 1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-faint)', marginBottom: '.375rem' }}>Notas</div>
              <div style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{med.notes}</div>
            </div>
          )}

          {/* Mark administered form */}
          {markMode && (
            <div style={{ background: 'var(--success-hl)', border: '1.5px solid var(--success)', borderRadius: 'var(--r-xl)', padding: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--success)', marginBottom: '.75rem' }}>✓ Registrar administración</div>
              <div className="detail-date-row">
                <label>Administrado el</label>
                <input type="date" value={adminDate}
                  onChange={e => setAdminDate(e.target.value)}
                  max={today}/>
              </div>
            </div>
          )}
        </div>

        <div className="detail-footer">
          {!markMode ? (
            <>
              <button className="btn btn-secondary" onClick={() => { onEdit(med); onClose() }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
                Editar
              </button>
              {!med.archived && (
                <button className="btn btn-success" onClick={() => setMarkMode(true)}>
                  💊 Marcar administrado
                </button>
              )}
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setMarkMode(false)}>Cancelar</button>
              <button className="btn btn-success" onClick={handleMark}>✓ Confirmar</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
