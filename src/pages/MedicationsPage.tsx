//traduzido e sem mock
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../components/AppLayout'
import AddMedicationModal from '../components/AddMedicationModal'
import EditMedModal from '../components/EditMedModal'
import MedDetailModal from '../components/MedDetailModal'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord } from '../components/EditMedModal'
import BackButton from '../components/BackButton'
import { useMedications } from '../context/MedicationsContext'


export default function MedicationsPage() {
  const {
    active, history, addMedication, updateMedication,
    deleteMedication, archiveMedication, unarchiveMedication, markMedicationAdministered,
  } = useMedications()

  const { t, i18n } = useTranslation()
  

  const [addOpen,   setAddOpen]   = useState(false)
  const [editOpen,  setEditOpen]  = useState(false)
  const [editMed,   setEditMed]   = useState<MedRecord | null>(null)
  const [detailMed, setDetailMed] = useState<MedRecord | null>(null)

  const openEdit   = (med: MedRecord) => { setEditMed(med); setEditOpen(true) }
  const openDetail = (med: MedRecord) => { setDetailMed(med) }
  const handleAdd  = (data: AddMedData) => { addMedication(data) }

  const handleSaveEdit = (updated: MedRecord) => {
    updateMedication(updated)
    showToast(t('toast.medSaved'))
  }

  const handleDelete = (id: string) => {
    deleteMedication(id)
    showToast(t('toast.medDeleted'))
  }

  const handleArchive = (id: string) => {
    archiveMedication(id)
    showToast(t('toast.medArchived'))
  }

  const handleUnarchive = (id: string) => {
    unarchiveMedication(id)
    showToast(t('toast.medUnarchived'))
  }

const handleMarkAdministered = (med: MedRecord, date: string) => {
  const dateStr = markMedicationAdministered(med, date, i18n.language)
  showToast(`${med.title} — ${dateStr}`)
}
  const handleDetailEdit = (med: MedRecord) => {
    setDetailMed(null)
    openEdit(med)
  }

  // ✅ próximas doses derivadas dos medicamentos activos — sem INITIAL_DOSES hardcoded
  const nextDoses = active
    .filter(m => m.endDate)
    .map(m => {
      const ms   = new Date(m.endDate! + 'T12:00:00').getTime() - Date.now()
      const days = Math.ceil(ms / 86_400_000)
      return { med: m, days }
    })
    .sort((a, b) => a.days - b.days)
    .slice(0, 5)

  return (
    <div>
      <BackButton />

      <div className="page-header">
        <div>
          <div className="page-title">{t('medications.title')}</div>
          <div className="page-subtitle">{t('medications.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {t('medications.add')}
        </button>
      </div>

      <div className="grid-2">
        {/* ── Medicamentos activos ── */}
        <div className="card">
          <div className="card-title">
            {t('medications.active')}
            {active.length > 0 && <span className="badge badge-green">{active.length}</span>}
          </div>
          {active.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              {t('medications.emptyActive')}
            </div>
          ) : (
            active.map(m => (
              <div key={m.id} className="list-item" style={{ cursor:'pointer' }} onClick={() => openDetail(m)}>
                <div className="list-item-icon" style={{ background:m.bg, color:m.color }}>{m.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">{m.dose} · {m.frequency}</div>
                </div>
                <div className="med-row-actions">
                  <span className={`badge ${m.badgeCls}`}>{m.badge}</span>
                  <button className="med-archive-btn" title={t('btn.archive')}
                    onClick={e => { e.stopPropagation(); handleArchive(m.id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"/>
                      <rect x="1" y="3" width="22" height="5" rx="1"/>
                      <line x1="10" y1="12" x2="14" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Historial ── */}
        <div className="card">
          <div className="card-title">{t('medications.history')}</div>
          {history.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              {t('medications.emptyHistory')}
            </div>
          ) : (
            history.map(m => (
              <div key={m.id} className="list-item" style={{ opacity:.7, cursor:'pointer' }} onClick={() => openDetail(m)}>
                <div className="list-item-icon" style={{ background:'var(--surface-offset)', color:'var(--text-faint)' }}>
                  {m.icon}
                </div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">
                    {m.dose}
                    {m.startDate ? ` · ${new Date(m.startDate+'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' })}` : ''}
                    {m.endDate   ? ` → ${new Date(m.endDate  +'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' })}` : ''}
                  </div>
                </div>
                <div className="med-row-actions">
                  <span className="badge badge-gray">{t('medications.finished')}</span>
                  <button className="med-edit-btn" title={t('medications.unarchive')}
                    style={{ background:'var(--success-hl)', color:'var(--success)' }}
                    onClick={e => { e.stopPropagation(); handleUnarchive(m.id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"/>
                      <rect x="1" y="3" width="22" height="5" rx="1"/>
                      <polyline points="10 12 12 10 14 12"/>
                      <line x1="12" y1="10" x2="12" y2="16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop:'1.125rem' }}>
        {/* ── Adherência ── */}
        <div className="card">
          <div className="card-title">{t('medications.adherence')}</div>
          {active.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              {t('medications.emptyActive')}
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', padding:'.5rem 0' }}>
              {/* ✅ anel calculado dinamicamente */}
              {(() => {
                const total = active.length
                const pct   = total > 0
                  ? Math.round(active.filter(m => m.badgeCls === 'badge-green').length / total * 100)
                  : 100
                const circ  = 2 * Math.PI * 36
                const offset = circ - (pct / 100) * circ
                return (
                  <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink:0 }}>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="var(--surface-offset)" strokeWidth="9"/>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="var(--success)" strokeWidth="9"
                      strokeDasharray={circ} strokeDashoffset={offset}
                      strokeLinecap="round" transform="rotate(-90 45 45)"/>
                    <text x="45" y="50" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="800" fontSize="20" fill="var(--text)">
                      {pct}%
                    </text>
                  </svg>
                )
              })()}
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'.625rem' }}>
                {active.map(m => {
                  const ms   = m.endDate ? new Date(m.endDate+'T12:00:00').getTime() - Date.now() : null
                  const days = ms !== null ? Math.ceil(ms / 86_400_000) : null
                  const pct  = m.badgeCls === 'badge-green' ? 100 : m.badgeCls === 'badge-yellow' ? 70 : 40
                  return (
                    <div key={m.id}>
                      <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'.3rem' }}>
                        {m.title.toUpperCase()}
                      </div>
                      <div className="progress-wrap">
                        <div className={`progress-bar ${m.badgeCls === 'badge-green' ? 'success' : 'warn'}`} style={{ width:`${pct}%` }}/>
                      </div>
                      <div style={{ fontSize:'.7rem', color: m.badgeCls === 'badge-green' ? 'var(--success)' : 'var(--warn)', marginTop:'.2rem', fontWeight:700 }}>
                        {days !== null
                          ? `${t('medications.nextDose')} ${days}d`
                          : t('vaccines.upToDate') + ' ✓'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Próximas doses ── */}
        <div className="card">
          <div className="card-title">{t('medications.nextDoses')}</div>
          {nextDoses.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              {t('medications.emptyActive')}
            </div>
          ) : (
            nextDoses.map(({ med, days }) => (
              <div key={med.id} className="list-item" style={{ cursor:'pointer' }} onClick={() => openDetail(med)}>
                <div className="list-item-icon" style={{ background:med.bg, color:med.color }}>{med.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{med.title}</div>
                  <div className="list-item-sub">
                    {new Date(med.endDate!+'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' })}
                  </div>
                </div>
                <div className="med-row-actions">
                  <span className={`badge ${med.badgeCls}`}>{days}d</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddMedicationModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd}/>
      <EditMedModal isOpen={editOpen} onClose={() => setEditOpen(false)} med={editMed} onSave={handleSaveEdit} onDelete={handleDelete}/>
      <MedDetailModal med={detailMed} onClose={() => setDetailMed(null)} onEdit={handleDetailEdit} onMarkAdministered={handleMarkAdministered}/>
    </div>
  )
}