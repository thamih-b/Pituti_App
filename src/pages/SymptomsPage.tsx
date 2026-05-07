// traduzido e mock

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../components/AppLayout'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import { useSymptoms } from '../context/SymptomsContext'
import type { SymptomEntry } from '../context/SymptomsContext'
import type { SymptomData } from '../components/RegisterSymptomModal'
import { usePetsContext } from '../context/PetsContext'
import BackButton from '../components/BackButton'

const SEV_ICON:  Record<string, string> = { leve:'🟡', moderado:'🟠', grave:'🔴', emergencia:'🚨' }
const SEV_BADGE: Record<string, string> = { leve:'badge-yellow', moderado:'badge-yellow', grave:'badge-red', emergencia:'badge-red' }
const CAT_ICON:  Record<string, string> = { digestivo:'🤢', respiratorio:'🫁', piel:'🩹', comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓' }
const SEV_COLOR: Record<string, string> = { leve:'var(--gold)', moderado:'var(--warn)', grave:'var(--err)', emergencia:'var(--err)' }
const SEV_BG:    Record<string, string> = { leve:'var(--gold-hl)', moderado:'var(--warn-hl)', grave:'var(--err-hl)', emergencia:'var(--err-hl)' }

const PET_EMOJI_SPECIES: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

function PencilIcon({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
}

export default function SymptomsPage() {
  const { t } = useTranslation()
  const { symptoms, addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const { pets } = usePetsContext()

  const [addOpen,   setAddOpen]   = useState(false)
  const [detailSym, setDetailSym] = useState<SymptomEntry | null>(null)
  const [editSym,   setEditSym]   = useState<SymptomEntry | null>(null)
  const [editOpen,  setEditOpen]  = useState(false)

  const active   = symptoms.filter(s => !s.resolved)
  const resolved = symptoms.filter(s =>  s.resolved)

  const openEdit = (s: SymptomEntry) => { setEditSym(s); setEditOpen(true) }

  // ✅ lookup dinâmico via contexto
  const getPet = (petId: string) => pets.find(p => p.id === petId)
  const getPetEmoji = (petId: string) => PET_EMOJI_SPECIES[getPet(petId)?.species ?? ''] ?? '🐾'
  const getPetName  = (petId: string) => getPet(petId)?.name ?? petId

  const handleAdd = (d: SymptomData) => {
    addSymptom({ ...d, resolved: false })
    showToast(`${SEV_ICON[d.severity] ?? '🌡️'} ${t('pet.symptoms.toastAdded')}`)
  }

  const SymptomRow = ({ s, dim = false }: { s: SymptomEntry; dim?: boolean }) => (
    <div className="list-item symptom-row-clickable" style={{ opacity: dim ? .7 : 1 }} onClick={() => setDetailSym(s)}>
      <div className="list-item-icon" style={{
        background: dim ? 'var(--surface-offset)' : SEV_BG[s.severity]  || 'var(--err-hl)',
        color:      dim ? 'var(--text-faint)'      : SEV_COLOR[s.severity] || 'var(--err)',
      }}>
        {CAT_ICON[s.category] ?? '🌡️'}
      </div>
      <div className="list-item-info">
        <div className="list-item-title">
          {SEV_ICON[s.severity]} {s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''} — {getPetEmoji(s.petId)} {getPetName(s.petId)}
        </div>
        <div className="list-item-sub">
          {new Date(s.date + 'T12:00:00').toLocaleDateString(t('dates.locale'))} · {t(`symptoms.categoryOptions.${s.category}` as any)}
          {s.resolved ? ` · ${t('pet.symptoms.statusResolved')}` : ` · ${t('pet.symptoms.statusActive')}`}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'.25rem', alignItems:'flex-end', flexShrink:0 }}>
        <span className={`badge ${s.resolved ? 'badge-gray' : SEV_BADGE[s.severity] ?? 'badge-yellow'}`}>
          {s.resolved ? t('pet.symptoms.statusResolved') : t('pet.symptoms.statusActive')}
        </span>
        <button className="med-edit-btn" style={{ width:26, height:26 }} title={t('btn.edit')}
          onClick={e => { e.stopPropagation(); openEdit(s) }}>
          <PencilIcon size={12}/>
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <BackButton />
      <div className="page-header">
        <div>
          <div className="page-title">{t('symptoms.title')}</div>
          <div className="page-subtitle">{t('symptoms.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          {t('symptoms.register')}
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            {t('symptoms.active')}
            {/* ✅ chave existente: pet.symptoms.statusActive */}
            {active.length > 0 && (
              <span className="badge badge-red">
                {active.length} {t('pet.symptoms.statusActive')}
              </span>
            )}
          </div>
          {active.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
                {t('symptoms.noActive')} ✓
              </div>
            : active.map(s => <SymptomRow key={s.id} s={s}/>)
          }
        </div>

        <div className="card">
          <div className="card-title">{t('symptoms.resolved')}</div>
          {resolved.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
                {t('symptoms.noResolved')}
              </div>
            : resolved.map(s => <SymptomRow key={s.id} s={s} dim/>)
          }
        </div>
      </div>

      <div className="card" style={{ marginTop:'1.125rem' }}>
        <div className="card-title">{t('symptoms.history')}</div>
        <div className="timeline">
          {[...active, ...resolved].slice(0, 8).map(s => (
            <div key={s.id} className="timeline-item symptom-row-clickable" onClick={() => setDetailSym(s)}>
              <div className="tl-icon symptom">{CAT_ICON[s.category] ?? '🌡️'}</div>
              <div style={{ flex:1 }}>
                <div className="tl-title">
                  {s.description.slice(0, 50)}{s.description.length > 50 ? '…' : ''} · {getPetEmoji(s.petId)} {getPetName(s.petId)}
                </div>
                <div className="tl-meta">
                  {/* ✅ chaves existentes em todos os JSONs */}
                  {s.resolved ? t('pet.symptoms.statusResolved') : t('pet.symptoms.statusActive')} · {t(`symptoms.categoryOptions.${s.category}` as any)}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'.25rem' }}>
                <div className="tl-time">
                  {new Date(s.date + 'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short' })}
                </div>
                <button className="med-edit-btn" style={{ width:24, height:24 }}
                  onClick={e => { e.stopPropagation(); openEdit(s) }}>
                  <PencilIcon size={11}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegisterSymptomModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd}/>

      <SymptomDetailModal
        symptom={detailSym}
        onClose={() => setDetailSym(null)}
        onEdit={s => { setDetailSym(null); openEdit(s) }}
        onResolve={id => { resolve(id); showToast(`✓ ${t('toast.symptomResolved')}`) }}
        onUnresolve={id => { unresolve(id); showToast(`↩ ${t('toast.symptomReopened')}`) }}
      />

      <EditSymptomModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        symptom={editSym}
        onSave={updated => { saveSymptom(updated); setEditOpen(false) }}
      />
    </div>
  )
}