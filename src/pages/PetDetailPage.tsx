// traduzido — sem mock, sem extraVacc local

import { useState, useRef, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { getVaccStatus } from '../utils/vaccUtils'
import type { VaccineRecord } from '../utils/vaccUtils'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import VaccRing from '../components/VaccRing'
import AddCareModal from '../components/AddCareModal'
import AddMedicationModal, { type AddMedData } from '../components/AddMedicationModal'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import NewNoteModal from '../components/NewNoteModal'
import EditPetModal from '../components/EditPetModal'
import EditCareModal from '../components/EditCareModal'
import PetChipEditOverlay from '../components/PetChipEditOverlay'
import { PfBtn, PfFooter } from '../components/FooterButtons'
import InviteSentOverlay from '../components/InviteSentOverlay'
import type { CareEditData } from '../components/EditCareModal'
import type { SymptomData } from '../components/RegisterSymptomModal'
import { useSymptoms, usePetSymptoms } from '../context/SymptomsContext'
import type { SymptomEntry } from '../context/SymptomsContext'
import CareDetailModal from '../components/CareDetailModal'
import type { CareDetailItem } from '../components/CareDetailModal'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import MedDetailModal from '../components/MedDetailModal'
import EditMedModal from '../components/EditMedModal'
import type { MedRecord } from '../components/EditMedModal'
import { NoteDetailModal, EditNoteModal } from '../components/NoteModals'
import type { NoteEntry } from '../components/NoteModals'
import { usePetCares, isDueOnDate, getNextDueDate, useCares } from '../context/CaresContext'
import { useVaccinesContext } from '../context/VaccinesContext'
import { useTranslation } from 'react-i18next'
import { usePetsContext } from '../context/PetsContext'
import { useMedications } from '../context/MedicationsContext'
import RegisterVaccineModal from '../components/RegisterVaccineModal'
import type { RegisterVaccineData } from '../components/RegisterVaccineModal'
import { medicalProfilesApi } from '../api'
import type { ApiMedicalProfile } from '../api'
import { resizeImageToDataUrl } from '../utils/imageResize'

type ChipField = 'species' | 'birthDate' | 'weight' | 'caregivers'

const NOTE_ICON: Record<string, string> = {
  control: '🩺', observacion: '📝', emergencia: '🚨',
  vacuna: '💉', cirugia: '🏥', otro: '📋',
}
const NOTE_BG: Record<string, string> = {
  control: 'var(--blue-hl)', observacion: 'var(--primary-hl)', emergencia: 'var(--err-hl)',
  vacuna: 'var(--success-hl)', cirugia: 'var(--warn-hl)', otro: 'var(--surface-offset)',
}
const NOTE_COLOR: Record<string, string> = {
  control: 'var(--blue)', observacion: 'var(--primary)', emergencia: 'var(--err)',
  vacuna: 'var(--success)', cirugia: 'var(--warn)', otro: 'var(--text-muted)',
}



function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill"
      style={{ background: on ? 'var(--primary)' : 'var(--border)' }}
      onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}



// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ petName, isOpen, onClose }: {
  petName: string; isOpen: boolean; onClose: () => void
}) {
  const { t } = useTranslation()
  const [email, setEmail]           = useState('')
  const [role, setRole]             = useState('caregiver')
  const [emailErr, setEmailErr]     = useState('')
  const [caregivers, setCaregivers] = useState([
    { id: 'tl', initials: 'TL', name: 'Thamires Lopes', role: t('pet.share.roleOwner'),     bg: 'var(--pal-lilac)', color: 'var(--nav-bg)', badge: t('pet.share.badgeYou') as string | null, removable: false },
    { id: 'am', initials: 'AM', name: 'Ana Martínez',   role: t('pet.share.roleCaregiver'), bg: 'var(--blue-hl)',   color: 'var(--blue)',   badge: null as string | null,                   removable: true  },
  ])
  const [inviteSent, setInviteSent] = useState(false)
  const [sentEmail, setSentEmail]   = useState('')

  const ACCESS = [
    { val: 'readonly',  icon: '👁',  label: t('pet.share.accessReadonly'),  sub: t('pet.share.accessReadonlySub')  },
    { val: 'caregiver', icon: '✏️', label: t('pet.share.accessCaregiver'), sub: t('pet.share.accessCaregiverSub') },
    { val: 'full',      icon: '⚙️', label: t('pet.share.accessFull'),      sub: t('pet.share.accessFullSub')      },
  ]

  const handleInvite = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailErr(t('pet.share.errEmail'))
      return
    }
    const initials  = email.split('@')[0].slice(0, 2).toUpperCase()
    const roleLabel = ACCESS.find(a => a.val === role)?.label ?? role
    setCaregivers(p => [...p, {
      id: Date.now().toString(), initials, name: email, role: roleLabel,
      bg: 'var(--gold-hl)', color: 'var(--gold)', badge: null, removable: true,
    }])
    setSentEmail(email); setEmail(''); setEmailErr(''); setInviteSent(true)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}
        title={t('pet.share.title')}
        subtitle={t('pet.share.subtitle', { name: petName })}
        icon="👥" accentBg="var(--blue-hl)" accentFg="var(--blue)" size="md"
        footer={<PfFooter><PfBtn variant="add" onClick={handleInvite}>{t('pet.share.sendBtn')}</PfBtn></PfFooter>}>
        <div className="modal-section">
          {t('pet.share.activeCaregivers')} <span className="badge badge-gray">{caregivers.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '.5rem' }}>
          {caregivers.map(u => (
            <div key={u.id} className="caregiver-row">
              <div className="caregiver-row-avatar" style={{ background: u.bg, color: u.color }}>{u.initials}</div>
              <div style={{ flex: 1 }}>
                <div className="caregiver-row-name">{u.name}</div>
                <div className="caregiver-row-role">{u.role}</div>
              </div>
              {u.badge
                ? <span className="badge badge-green">{u.badge}</span>
                : <PfBtn variant="delete" size="sm" onClick={() => {
                    setCaregivers(p => p.filter(c => c.id !== u.id))
                    showToast(t('pet.share.toastRemoved'))
                  }}>{t('btn.delete')}</PfBtn>}
            </div>
          ))}
        </div>
        <div className="modal-section">{t('pet.share.inviteTitle')}</div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">{t('field.email')} *</label>
          <div className="field-icon-wrap" style={{ width: '100%' }}>
            <span className="field-icon">✉</span>
            <input className={['form-input', emailErr ? 'form-input--err' : ''].join(' ')}
              type="email" placeholder={t('pet.share.emailPh')}
              value={email} onChange={e => { setEmail(e.target.value); setEmailErr('') }}
              style={{ width: '100%' }} />
          </div>
          {emailErr && <span className="form-hint-err">{emailErr}</span>}
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t('pet.share.accessLevel')}</label>
          <div className="access-options">
            {ACCESS.map(a => (
              <div key={a.val}
                className={['access-option', role === a.val ? 'selected' : ''].join(' ')}
                onClick={() => setRole(a.val)}>
                <div className="access-option-icon">{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="access-option-label">{a.label}</div>
                  <div className="access-option-sub">{a.sub}</div>
                </div>
                <div className="access-radio" />
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {inviteSent && <InviteSentOverlay email={sentEmail} onClose={() => setInviteSent(false)} />}
    </>
  )
}

// ─── Tab Cares ────────────────────────────────────────────────────────────────

function TabCares({ petId, petName }: { petId: string; petName: string }) {
  const { t } = useTranslation()
  const petItems = usePetCares(petId)
  const { addCare, editCare, deleteCare, setCareProgress } = useCares()
  const today = new Date().toISOString().split('T')[0]

  const daily = petItems.filter(i => isDueOnDate(i, today))
  const scheduled = petItems
    .filter(i => i.intervalDays > 1 && !isDueOnDate(i, today))
    .map(i => ({ item: i, nextDate: getNextDueDate(i, today) }))
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))

  const [editItem, setEditItem]     = useState<CareEditData | null>(null)
  const [editOpen, setEditOpen]     = useState(false)
  const [addOpen, setAddOpen]       = useState(false)
  const [detailItem, setDetailItem] = useState<CareDetailItem | null>(null)

  const getDone = (item: ReturnType<typeof usePetCares>[0]) =>
    item.doneByDate[today] ?? { done: 0, doneState: false }

  const toDetailItem = (item: ReturnType<typeof usePetCares>[0]): CareDetailItem => {
    const d = getDone(item)
    return {
      id: item.id, petId, emoji: item.emoji, title: item.title,
      sub: item.sub, total: item.total, done: d.done, done_state: d.doneState, bg: item.bg,
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
            {t('pet.cares.todayTitle')}
          </div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {t('pet.cares.todayProgress', {
              done:  String(daily.filter(i => getDone(i).doneState).length),
              total: String(daily.length),
            })}
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t('btn.add')}
        </button>
      </div>

      <div className="care-grid">
        {daily.map(item => {
          const d = getDone(item)
          return (
            <div key={item.id}
              className={['care-card', d.doneState ? 'done' : ''].join(' ')}
              onClick={() => setDetailItem(toDetailItem(item))}
              style={{ cursor: 'pointer' }}>
              <div className="care-header">
                <div className="care-emoji" style={{ background: item.bg }}>{item.emoji}</div>
                <div>
                  <div className="care-title">{item.title}</div>
                  <div className="care-sub">{item.sub}</div>
                </div>
              </div>
              <div className="care-progress">
                <div className="care-dots">
                  {Array.from({ length: Math.min(item.total, 7) }).map((_, j) => (
                    <div key={j} className={`care-dot ${j < d.done ? 'done' : ''}`} />
                  ))}
                </div>
                <span>
                  {d.doneState
                    ? <span style={{ color: 'var(--success)' }}>{t('pet.cares.done')}</span>
                    : `${d.done}/${item.total}`}
                </span>
              </div>
              <div className="care-actions" onClick={e => e.stopPropagation()}>
                <button
                  className={`care-btn-do ${d.doneState ? 'done-btn' : ''}`}
                  onClick={() => {
                    const ns = !getDone(item).doneState
                    setCareProgress(item.id, today, ns ? item.total : 0, ns)
                    showToast(ns
                      ? `✓ ${item.title} ${t('pet.cares.toastDone')}`
                      : `↩ ${item.title} ${t('pet.cares.toastUndone')}`)
                  }}>
                  {d.doneState ? t('pet.cares.done') : t('pet.cares.register')}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {scheduled.length > 0 && (
        <div style={{
          marginTop: '1rem', background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)', padding: '.875rem 1rem',
        }}>
          <div style={{
            fontSize: '.75rem', fontWeight: 800, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '.25rem',
          }}>
            📅 {t('pet.cares.scheduled')}
          </div>
          {scheduled.map(({ item, nextDate }) => {
            const daysFromNow = Math.round(
              (new Date(nextDate + 'T00:00:00').getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000
            )
            const dateLabel = new Date(nextDate + 'T12:00:00').toLocaleDateString(undefined, {
              weekday: 'short', day: 'numeric', month: 'short',
            })
            return (
              <div key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.625rem .25rem',
                  borderBottom: '1px solid var(--divider)', cursor: 'pointer',
                }}
                onClick={() => setDetailItem(toDetailItem(item))}>
                <div style={{
                  background: item.bg, width: 36, height: 36, borderRadius: 'var(--r-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', flexShrink: 0,
                }}>{item.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)' }}>{item.title}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>{item.sub}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '.8125rem', fontWeight: 800, color: 'var(--primary)' }}>{dateLabel}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', marginTop: '.1rem' }}>
                    {daysFromNow === 0 ? t('vet.time.today') : t('vet.time.inDays', { n: String(daysFromNow) })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {detailItem && (
        <CareDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onToggle={(id, newDone, newState) => {
            setCareProgress(id, today, newDone, newState)
            setDetailItem(prev => prev ? { ...prev, done: newDone, done_state: newState } : null)
          }}
          onEdit={detail => {
            setDetailItem(null)
            const item = petItems.find(i => i.id === detail.id)
            if (item) {
              setEditItem({
                id: item.id, emoji: item.emoji, title: item.title, total: item.total,
                period: item.period, quantity: item.quantity, notify: item.notify, bg: item.bg,
                time: item.time, intervalDays: item.intervalDays, recurring: item.recurring,
              })
              setEditOpen(true)
            }
          }}
        />
      )}

      <EditCareModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        care={editItem}
        onSave={updated => {
          const item = petItems.find(i => i.id === updated.id)
          if (!item) return
          editCare({
            ...item,
            emoji: updated.emoji, title: updated.title, total: updated.total,
            period: updated.period ?? 'day', quantity: updated.quantity ?? '',
            notify: updated.notify,
            sub: `${updated.total}× ${updated.period === 'day' ? t('pet.cares.periodDay') : t('pet.cares.periodWeek')}${updated.quantity ? ' · ' + updated.quantity : ''}`,
            time: updated.time ?? '', intervalDays: updated.intervalDays ?? 1,
            recurring: updated.recurring ?? true,
          })
          showToast(`${updated.emoji} ${updated.title} ${t('pet.cares.toastUpdated')}`)
          setEditOpen(false)
        }}
        onDelete={id => {
          deleteCare(id)
          setEditOpen(false)
          showToast(t('pet.cares.toastDeleted'))
        }}
      />

      <AddCareModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        defaultPetId={petId}
        onAdd={d => {
          addCare({
            petId: d.petId, emoji: d.emoji, title: d.title,
            sub: `${d.total}× ${d.period === 'day' ? t('pet.cares.periodDay') : t('pet.cares.periodWeek')}${d.quantity ? ' · ' + d.quantity : ''}`,
            total: d.total, period: d.period ?? 'day', quantity: d.quantity,
            notify: d.notify, bg: '', time: d.time ?? '',
            intervalDays: d.intervalDays ?? 1, recurring: d.recurring ?? true, startDate: today,
          })
          showToast(`${d.emoji} ${d.title} ${t('pet.cares.toastAdded')}`)
        }}
      />
    </>
  )
}

// ─── Tab Vaccines ─────────────────────────────────────────────────────────────

function TabVaccines({ petId, petName, petSpecies }: {
  petId: string; petName: string; petSpecies: string
}) {
  const { t } = useTranslation()
  const { vaccinesByPet, addVaccine, updateVaccine } = useVaccinesContext()
  const [registerOpen, setRegisterOpen] = useState(false)
  const [vaccDetail, setVaccDetail]     = useState<(VaccineRecord & { cls: 'ok' | 'soon' | 'late' }) | null>(null)
  const [editVacc, setEditVacc]         = useState<VaccineRecord | null>(null)
  const [editVaccOpen, setEditVaccOpen] = useState(false)

  const vaccines   = vaccinesByPet[petId] ?? []
  const withStatus = vaccines.map(vacc => ({ ...vacc, cls: getVaccStatus(vacc.nextDate) as 'ok' | 'soon' | 'late' }))
  const okCount    = withStatus.filter(vacc => vacc.cls === 'ok').length
  const alDia      = withStatus.filter(vacc => vacc.cls === 'ok' || vacc.cls === 'soon').length
  const pending    = withStatus.filter(vacc => vacc.cls === 'soon' || vacc.cls === 'late').length
  const total      = vaccines.length
  const cov        = total > 0 ? Math.round(okCount / total * 100) : 100
  const alPct      = total > 0 ? Math.round(alDia / total * 100) : 100
  const penPct     = total > 0 ? Math.round(pending / total * 100) : 0

  const VACC_BADGE = {
    ok:   { badge: t('pet.vacc.badgeOk'),   cls: 'badge-green'  },
    soon: { badge: t('pet.vacc.badgeSoon'), cls: 'badge-yellow' },
    late: { badge: t('pet.vacc.badgeLate'), cls: 'badge-red'    },
  }
  

  // FIX: chama addVaccine com AddVaccineInput (datas ISO brutas, não formatadas)
  const handleRegister = (v: RegisterVaccineData) => {
    addVaccine(petId, {
      name:     v.name,
      date:     v.date,     // ISO
      nextDate: v.nextDate, // ISO
      vet:      v.vet,
      notes:    v.notes,
    })
  }

  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            {t('pet.vacc.title')}
            <button className="btn btn-primary btn-sm" onClick={() => setRegisterOpen(true)}>
              💉 {t('pet.vacc.registerBtn')}
            </button>
          </div>
          {withStatus.length === 0
            ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                {t('pet.vacc.empty')}
              </div>
            : withStatus.map(vacc => (
                <div key={vacc.name + vacc.nextDate} className="vaccine-row"
                  onClick={() => setVaccDetail(vacc)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.75rem 0', borderBottom: '1.5px solid var(--divider)', cursor: 'pointer' }}>
                  <div className="vaccine-icon" style={{
                    background: vacc.cls === 'ok' ? 'var(--success-hl)' : vacc.cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
                    color:      vacc.cls === 'ok' ? 'var(--success)'    : vacc.cls === 'soon' ? 'var(--gold)'    : 'var(--err)',
                  }}>💉</div>
                  <div style={{ flex: 1 }}>
                    <div className="vaccine-name">{vacc.name}</div>
                    <div className="vaccine-date">{t('pet.vacc.applied')} {vacc.applied}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`vaccine-next ${vacc.cls}`}>
  {!vacc.nextDate
    ? '—'
    : vacc.cls === 'late'
      ? `${t('pet.vacc.expired')} · ${new Date(vacc.nextDate + 'T12:00:00').toLocaleDateString()}`
      : `${t('pet.vacc.next')} ${new Date(vacc.nextDate + 'T12:00:00').toLocaleDateString()}`}
</div>

                    <span className={`badge ${vacc.badgeCls}`} style={{ fontSize: '.6rem' }}>{vacc.badge}</span>
                  </div>
                </div>
              ))}
        </div>
        <div className="card">
          <div className="card-title">{t('pet.vacc.coverage')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
            <VaccRing coverage={cov} size={96} strokeWidth={8} />
          </div>
          {[
            { label: t('pet.vacc.coverageTotal'),   pct: cov,    color: ''                              },
            { label: t('pet.vacc.coverageOk'),      pct: alPct,  color: 'success'                       },
            { label: t('pet.vacc.coveragePending'), pct: penPct, color: penPct > 0 ? 'warn' : 'success' },
          ].map(b => (
            <div key={b.label} style={{ marginBottom: '.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8125rem', marginBottom: '.375rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{b.label}</span>
                <span style={{ fontWeight: 700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap">
                <div className={`progress-bar ${b.color}`} style={{ width: `${b.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegisterVaccineModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        petName={petName}
        petSpecies={petSpecies}
        onRegister={handleRegister}
      />

      <VaccineDetailModal
        vaccine={vaccDetail ? { ...vaccDetail, petName, petEmoji: SPECIES_EMOJI[petSpecies] ?? '🐾' } : null}
        onClose={() => setVaccDetail(null)}
        onEdit={vacc => { setVaccDetail(null); setEditVacc(vacc); setEditVaccOpen(true) }}
        onMarkApplied={(vacc, appliedDate, nextDate) => {
          const lbl = new Date(appliedDate + 'T12:00:00').toLocaleDateString(undefined, {
            day: '2-digit', month: 'short', year: 'numeric',
          })
          const cls = getVaccStatus(nextDate) as 'ok' | 'soon' | 'late'
          updateVaccine(petId, {
            ...vacc, applied: lbl, nextDate,
            badge: VACC_BADGE[cls].badge, badgeCls: VACC_BADGE[cls].cls,
          })
          setVaccDetail(null)
          showToast(t('pet.vacc.toastApplied'))
        }}
      />

      <EditVaccineModal
        isOpen={editVaccOpen}
        onClose={() => setEditVaccOpen(false)}
        vaccine={editVacc}
        onSave={updated => {
          updateVaccine(petId, updated)
          setEditVaccOpen(false)
          showToast(t('pet.vacc.toastUpdated'))
        }}
      />
    </>
  )
}

// ─── Pet Detail Page ──────────────────────────────────────────────────────────

export default function PetDetailPage() {
  const { t } = useTranslation()
  const { petId = '' } = useParams<{ petId: string }>()
  const navigate = useNavigate()
  const { pets, loading, updatePet } = usePetsContext()

  // ══════════════════════════════════════════════════════════════
  // TODOS os hooks ANTES de qualquer return condicional (Rules of
  // Hooks). histDetail, vaccinesByPet e histItems estavam depois
  // dos if-returns → React error #310.
  // ══════════════════════════════════════════════════════════════

  const [activeTab,      setActiveTab]      = useState(0)
  const [shareOpen,      setShareOpen]      = useState(false)
  const [editOpen,       setEditOpen]       = useState(false)
  const [addMedOpen,     setAddMedOpen]     = useState(false)
  const [addNoteOpen,    setAddNoteOpen]    = useState(false)
  const [addSymptomOpen, setAddSymptomOpen] = useState(false)
  const [chipField,      setChipField]      = useState<ChipField | null>(null)

  const petData = useMemo<PetWithAlerts | null>(() => {
    if (!petId || pets.length === 0) return null
    return (pets.find(p => p.id === petId) as PetWithAlerts | undefined) ?? null
  }, [pets, petId])

const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
  if (!petId) return null
  try { return localStorage.getItem(`pet-photo-${petId}`) ?? null } catch { return null }
})

useEffect(() => {
  if (petData?.photoUrl) {
    setPhotoUrl(petData.photoUrl)
    try { localStorage.setItem(`pet-photo-${petData.id}`, petData.photoUrl) } catch {}
  }
}, [petData?.photoUrl, petData?.id])


  const { addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const safePetId = petData?.id ?? ''
  const { active: activeSymptoms, resolved: resolvedSymptoms } = usePetSymptoms(safePetId)

  const [detailSym,   setDetailSym]   = useState<SymptomEntry | null>(null)
  const [editSym,     setEditSym]     = useState<SymptomEntry | null>(null)
  const [editSymOpen, setEditSymOpen] = useState(false)

  const photoRef = useRef<HTMLInputElement>(null)

  const {
    getActiveMedicationsByPetId,
    addMedication,
    updateMedication,
    deleteMedication,
  } = useMedications()

  const localMeds = safePetId ? getActiveMedicationsByPetId(safePetId) : []

  const [medDetail,    setMedDetail]    = useState<MedRecord | null>(null)
  const [editMed,      setEditMed]      = useState<MedRecord | null>(null)
  const [editMedOpen,  setEditMedOpen]  = useState(false)
  const [localNotes,   setLocalNotes]   = useState<NoteEntry[]>([])
  const [noteDetail,   setNoteDetail]   = useState<NoteEntry | null>(null)
  const [editNote,     setEditNote]     = useState<NoteEntry | null>(null)
  const [editNoteOpen, setEditNoteOpen] = useState(false)

  // FIX #310: estava DEPOIS dos returns condicionais
  const [histDetail, setHistDetail] = useState<{
    cls: string; icon: string; title: string; meta: string; time: string
    medId?: string; noteId?: string
  } | null>(null)

  const [medicalProfile, setMedicalProfile] = useState<ApiMedicalProfile | null>(null)

useEffect(() => {
  if (!petData?.id) return
  let cancelled = false
  medicalProfilesApi.get(petData.id)
    .then(res => { if (!cancelled) setMedicalProfile(res.data) })
    .catch(() => { if (!cancelled) setMedicalProfile(null) })
  return () => { cancelled = true }
}, [petData?.id])


  // FIX #310: estava DEPOIS dos returns condicionais
  const { vaccinesByPet } = useVaccinesContext()

  // ── Returns condicionais APÓS todos os hooks ────────────────────
  if (loading) {
    return <div className="page-loading">{t('common.loading')}</div>
  }

  if (!pets.length) {
    return (
      <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>🐾</div>
        <div style={{ fontWeight: 800, marginBottom: '.375rem' }}>{t('pets.noPets')}</div>
        <button className="btn btn-primary" onClick={() => navigate('/pets')}>
          {t('pets.addPet')}
        </button>
      </div>
    )
  }

  if (!petId || !petData) {
    return (
      <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>⚠️</div>
        <div style={{ fontWeight: 800, marginBottom: '.375rem' }}>{t('pet.notFound')}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/pets')}>
          {t('btn.back')}
        </button>
      </div>
    )
  }

  // ── daqui para baixo petData é garantidamente non-null ──────────

  const NOTE_LABEL: Record<string, string> = {
    control:     t('pet.noteType.control'),
    observacion: t('pet.noteType.observacion'),
    emergencia:  t('pet.noteType.emergencia'),
    vacuna:      t('pet.noteType.vacuna'),
    cirugia:     t('pet.noteType.cirugia'),
    otro:        t('pet.noteType.otro'),
  }

  const SPECIES_LABEL: Record<string, string> = {
    cat:  `${t('pet.speciesCat')} 🐱`,
    dog:  `${t('pet.speciesDog')} 🐶`,
    bird: `${t('pet.speciesBird')} 🦜`,
  }

  const TABS = [
    `🐾 ${t('pet.tabs.cares')}`,
    t('pet.tabs.vaccines'),
    t('pet.tabs.medications'),
    t('pet.tabs.symptoms'),
    t('pet.tabs.notes'),
    t('pet.tabs.history'),
  ]

  const SEV_COLOR: Record<string, string> = { leve: 'var(--gold)', moderado: 'var(--warn)', grave: 'var(--err)', emergencia: 'var(--err)' }
  const SEV_BG: Record<string, string>    = { leve: 'var(--gold-hl)', moderado: 'var(--warn-hl)', grave: 'var(--err-hl)', emergencia: 'var(--err-hl)' }
  const CAT_ICON: Record<string, string>  = { digestivo: '🤢', respiratorio: '🫁', piel: '🩹', comportamiento: '🧠', movimiento: '🦶', ocular: '👁', otro: '❓' }

  // FIX #310: histItems agora seguro (todos os hooks já executaram)
  const histItems = [
    ...(vaccinesByPet[petData.id] ?? []).map(vacc => ({
      cls: 'vaccine', icon: '💉',
      title: vacc.name, meta: vacc.applied,
      time: vacc.applied, medId: undefined, noteId: undefined,
    })),
    ...localMeds.map(m => ({
      cls: 'med', icon: '💊',
      title: m.title,
      meta: [m.dose, m.frequency].filter(Boolean).join(' · '),
      time: m.startDate ?? '',
      medId: m.id, noteId: undefined,
    })),
    ...localNotes.map(n => ({
      cls: 'note', icon: NOTE_ICON[n.type] ?? '📋',
      title: NOTE_LABEL[n.type] ?? t('pet.noteType.otro'),
      meta: n.content.slice(0, 40),
      time: n.date ?? '',
      medId: undefined, noteId: n.id,
    })),
  ].sort((a, b) => b.time.localeCompare(a.time))

const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file || !petData) return

  let resized: string
  try {
    resized = await resizeImageToDataUrl(file)
  } catch (err) {
    console.warn('[PetDetailPage] Falha ao processar a foto:', err)
    showToast(t('toast.photoError', { defaultValue: 'Não foi possível processar a foto' }), 'err')
    return
  }

  // Atualização otimista local (mantém a UI instantânea)
  setPhotoUrl(resized)
  try { localStorage.setItem('pet-photo-' + petData.id, resized) } catch {}
  showToast(t('pet.toastPhoto'))

  // FIX (sync): persiste através do updatePet já usado no resto da app
  updatePet(petData.id, { photoUrl: resized } as any).catch((err) => {
    console.warn('[PetDetailPage] Falha ao gravar a foto no servidor:', err)
    showToast(t('toast.syncError', { defaultValue: 'Guardado neste aparelho, mas falhou ao sincronizar' }), 'err')
  })
}



const handleChipSave = (updated: Partial<PetWithAlerts>) => {
  if (petData && Object.keys(updated).length > 0) {
    updatePet(petData.id, updated as any).catch(() => {
      showToast(t('toast.error', { defaultValue: 'Erro ao guardar' }), 'err')
    })
  }
  setChipField(null)
}

const handleChipSaveWeight = (weightKg: number | null) => {
  if (!petData) return
  medicalProfilesApi
    .upsert(petData.id, { ...(medicalProfile ?? {}), weightKg })
    .then(res => setMedicalProfile(res.data))
    .catch(() => {
      showToast(t('toast.error', { defaultValue: 'Erro ao guardar' }), 'err')
    })
}

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}
        onClick={() => navigate('/pets')}>
        ← {t('pet.backToList')}
      </button>

      {/* ── Hero header ── */}
      <div className="pet-profile-hero">
        {/*
          FIX FOTO: usa as classes CSS originais pet-photo-wrap / pet-photo-circle
          que já têm overflow:hidden + object-fit:cover na stylesheet.
          A foto fica perfeitamente contida no círculo de 90 × 90 px.
        */}
        <div className="pet-photo-wrap">
          <div className="pet-photo-circle">
            {photoUrl
              ? <img
                  src={photoUrl}
                  alt={petData.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    borderRadius: '50%',
                  }}
                />
              : <span>{SPECIES_EMOJI[petData.species] ?? '🐾'}</span>}
          </div>
          <button className="pet-photo-btn" onClick={() => photoRef.current?.click()}
            title={t('pet.changePhoto')}>📷</button>
          <input ref={photoRef} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handlePhotoChange} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>{petData.name}</h1>
            <span style={{ fontSize: '1.1rem' }}>{SPECIES_EMOJI[petData.species]}</span>
            <span className="badge badge-green" style={{ marginLeft: '.25rem' }}>{t('pet.statusHealthy')}</span>
          </div>
          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
            {petData.breed ?? t('pet.unknownBreed')}
          </p>
          <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
            {(petData.alerts ?? []).map((raw, i) => {
              const a = raw as unknown as { type: 'warn' | 'err'; text: string }
              return (
                <span key={i} className={`badge ${a.type === 'err' ? 'badge-red' : 'badge-yellow'}`}>
                  {a.type === 'warn' ? '⚠️' : '🔴'} {a.text.slice(0, 28)}…
                </span>
              )
            })}
            <span className="badge badge-blue">💊 {t('pet.activeMed')}</span>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => setEditOpen(true)}>
          ✏ {t('btn.edit')}
        </button>
      </div>

      {/* ── Stat chips ── */}
      <div className="stat-row">
        {([
          { label: t('pet.chipSpecies'),    field: 'species'    as ChipField, value: SPECIES_LABEL[petData.species] ?? petData.species },
          { label: t('pet.chipBirth'),      field: 'birthDate'  as ChipField, value: petData.birthDate ? new Date(petData.birthDate + 'T12:00:00').toLocaleDateString() : '—' },
{
  label: t('pet.chipWeight'),
  field: 'weight' as ChipField,
  value: medicalProfile?.weightKg != null ? `${medicalProfile.weightKg} kg` : '—',
},
          { label: t('pet.chipCaregivers'), field: 'caregivers' as ChipField, value: null },
        ] as const).map(s => (
          <div key={s.label} className="stat-chip clickable"
            onClick={() => setChipField(s.field)}
            title={`${t('btn.edit')} ${s.label}`}>
            <span className="stat-chip-edit-hint">✏</span>
            <div className="stat-chip-label">{s.label}</div>
            {s.value
              ? <div className="stat-chip-value" style={{ fontSize: '1rem' }}>{s.value}</div>
              : <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem' }}>TL</div>
                </div>}
          </div>
        ))}
      </div>

      {/* ── Caregivers share row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '1.125rem', padding: '.75rem 1rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-sm)' }}>
        <span style={{ fontSize: '.8125rem', fontWeight: 700, color: 'var(--text-muted)', flex: 1 }}>
          {t('pet.sharedCaregivers')}
        </span>
        <div className="caregiver-avatars">
          <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem' }}>TL</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShareOpen(true)}>
          👥 {t('pet.share.openBtn')}
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs">
        {TABS.map((tab, i) => (
          <div key={tab} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab}
          </div>
        ))}
      </div>

      {/* ── Tab content ── */}
      {activeTab === 0 && <TabCares petId={petData.id} petName={petData.name} />}
      {activeTab === 1 && (
        <TabVaccines
          petId={petData.id}
          petName={petData.name}
          petSpecies={petData.species}
        />
      )}

      {activeTab === 2 && (
        <div className="card">
          <div className="card-title">
            {t('pet.tabs.medications')}
            <button className="btn btn-primary btn-sm" onClick={() => setAddMedOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              {t('btn.add')}
            </button>
          </div>
          {localMeds.length === 0
            ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                {t('medications.emptyActive')}
              </div>
            : localMeds.map(m => (
              <div key={m.id} className="list-item" onClick={() => setMedDetail(m)} style={{ cursor: 'pointer' }}>
                <div className="list-item-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">{[m.dose, m.frequency].filter(Boolean).join(' · ')}</div>
                </div>
                <div className="list-item-right"><span className={`badge ${m.badgeCls}`}>{m.badge}</span></div>
              </div>
            ))
          }
        </div>
      )}

      {activeTab === 3 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
              {t('pet.symptoms.title', { name: petData.name })}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setAddSymptomOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              {t('pet.symptoms.registerBtn')}
            </button>
          </div>
          {activeSymptoms.length === 0 && resolvedSymptoms.length === 0
            ? <div className="empty-state" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🐾</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '.375rem' }}>
                  {t('pet.symptoms.emptyTitle', { name: petData.name })}
                </div>
                <div style={{ fontSize: '.875rem', marginBottom: '1.25rem' }}>
                  {t('pet.symptoms.emptyText')}
                </div>
              </div>
            : <div className="grid-2">
                <div className="card">
                  <div className="card-title">
                    {t('pet.symptoms.active')}
                    {activeSymptoms.length > 0 && <span className="badge badge-red">{activeSymptoms.length}</span>}
                  </div>
                  {activeSymptoms.length === 0
                    ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                        {t('pet.symptoms.noneActive')}
                      </div>
                    : activeSymptoms.map(s => (
                        <div key={s.id} className="list-item symptom-row-clickable" onClick={() => setDetailSym(s)}>
                          <div className="list-item-icon" style={{ background: SEV_BG[s.severity] || 'var(--err-hl)', color: SEV_COLOR[s.severity] || 'var(--err)' }}>
                            {CAT_ICON[s.category] ?? '🌡️'}
                          </div>
                          <div className="list-item-info">
                            <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''}</div>
                            <div className="list-item-sub">{s.category} · {new Date(s.date + 'T12:00:00').toLocaleDateString()}</div>
                          </div>
                          <span className="badge badge-yellow" style={{ flexShrink: 0 }}>{t('pet.symptoms.statusActive')}</span>
                        </div>
                      ))}
                </div>
                <div className="card">
                  <div className="card-title">{t('pet.symptoms.resolved')}</div>
                  {resolvedSymptoms.length === 0
                    ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                        {t('pet.symptoms.noneResolved')}
                      </div>
                    : resolvedSymptoms.map(s => (
                        <div key={s.id} className="list-item symptom-row-clickable" style={{ opacity: .7 }} onClick={() => setDetailSym(s)}>
                          <div className="list-item-icon" style={{ background: 'var(--surface-offset)', color: 'var(--text-faint)' }}>
                            {CAT_ICON[s.category] ?? '🌡️'}
                          </div>
                          <div className="list-item-info">
                            <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''}</div>
                            <div className="list-item-sub">{s.category} · {t('pet.symptoms.statusResolved')}</div>
                          </div>
                          <span className="badge badge-gray" style={{ flexShrink: 0 }}>{t('pet.symptoms.statusResolved')}</span>
                        </div>
                      ))}
                </div>
              </div>}
        </div>
      )}

      {activeTab === 4 && (
        <div className="card">
          <div className="card-title">
            {t('pet.tabs.notes')}
            <button className="btn btn-primary btn-sm" onClick={() => setAddNoteOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              {t('pet.notes.newBtn')}
            </button>
          </div>
          {localNotes.length === 0
            ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                {t('pet.notes.empty')}
              </div>
            : localNotes.map(n => (
                <div key={n.id} className="list-item" onClick={() => setNoteDetail(n)} style={{ cursor: 'pointer' }}>
                  <div className="list-item-icon" style={{ background: NOTE_BG[n.type] ?? 'var(--primary-hl)', color: NOTE_COLOR[n.type] ?? 'var(--primary)' }}>
                    {NOTE_ICON[n.type] ?? '📋'}
                  </div>
                  <div className="list-item-info">
                    <div className="list-item-title">
                      {NOTE_LABEL[n.type] ?? t('pet.noteType.otro')}{n.vet ? ` — ${n.vet}` : ''}
                    </div>
                    <div className="list-item-sub">{n.content.slice(0, 70)}{n.content.length > 70 ? '…' : ''}</div>
                  </div>
                  <span style={{ fontSize: '.75rem', color: 'var(--text-faint)', flexShrink: 0 }}>
                    {n.date ? new Date(n.date + 'T12:00:00').toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) : ''}
                  </span>
                </div>
              ))}
        </div>
      )}

      {activeTab === 5 && (
        <div className="card">
          <div className="card-title">{t('pet.history.title')}</div>
          <div className="timeline">
            {histItems.length === 0
              ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                  {t('pet.history.empty')}
                </div>
              : histItems.map((e, idx) => (
                  <div key={`${e.cls}-${idx}`} className="timeline-item" onClick={() => setHistDetail(e)} style={{ cursor: 'pointer' }}>
                    <div className={`tl-icon ${e.cls}`}>{e.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="tl-title">{e.title}</div>
                      <div className="tl-meta">{e.meta}</div>
                    </div>
                    <div className="tl-time">{e.time}</div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* ── Modals ── */}

      <ShareModal petName={petData.name} isOpen={shareOpen} onClose={() => setShareOpen(false)} />

      <EditPetModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        pet={petData}
        onSave={() => setEditOpen(false)}
      />

<PetChipEditOverlay
     pet={petData}
     field={chipField}
     onClose={() => setChipField(null)}
     onSave={handleChipSave}
     currentWeightKg={medicalProfile?.weightKg}
     onSaveWeight={handleChipSaveWeight}
   />

      <AddMedicationModal
        isOpen={addMedOpen}
        onClose={() => setAddMedOpen(false)}
        defaultPetId={petData.id}
        onAdd={(d: AddMedData) => {
          addMedication(d.petId, {
            petId:     d.petId,
            title:     d.name,
            dose:      d.dose,
            frequency: d.frequency,
            startDate: d.startDate,
            endDate:   d.endDate  ?? '',
            notes:     d.notes    ?? '',
          })
          showToast(`💊 ${t('toast.medAdded')}`)
          setAddMedOpen(false)
        }}
      />

      <RegisterSymptomModal
        isOpen={addSymptomOpen}
        onClose={() => setAddSymptomOpen(false)}
        defaultPetId={petData.id}
        onAdd={(d: SymptomData) => {
          addSymptom({ ...d, resolved: false })
          showToast(t('pet.symptoms.toastAdded'))
          setAddSymptomOpen(false)
        }}
      />

      <NewNoteModal
        isOpen={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        defaultPetId={petData.id}
        onAdd={(d) => {
          setLocalNotes(prev => [{ ...d, id: Date.now().toString(), archived: false }, ...prev])
          showToast(`📝 ${t('pet.notes.toastAdded')}`)
          setAddNoteOpen(false)
        }}
      />

      <SymptomDetailModal
        symptom={detailSym}
        onClose={() => setDetailSym(null)}
        onEdit={s => { setDetailSym(null); setEditSym(s); setEditSymOpen(true) }}
        onResolve={id   => { resolve(id);   setDetailSym(null); showToast(t('pet.symptoms.toastResolved'))  }}
        onUnresolve={id => { unresolve(id); setDetailSym(null); showToast(t('pet.symptoms.toastReopened')) }}
      />
      <EditSymptomModal
        isOpen={editSymOpen}
        onClose={() => setEditSymOpen(false)}
        symptom={editSym}
        onSave={updated => { saveSymptom(updated); setEditSymOpen(false); showToast(t('pet.symptoms.toastUpdated')) }}
      />

      <MedDetailModal
        med={medDetail}
        onClose={() => setMedDetail(null)}
        onEdit={m => { setMedDetail(null); setEditMed(m); setEditMedOpen(true) }}
        onMarkAdministered={(m, _date) => { showToast(`💊 ${m.title} ${t('pet.med.toastAdministered')}`); setMedDetail(null) }}
      />
      <EditMedModal
        isOpen={editMedOpen}
        onClose={() => setEditMedOpen(false)}
        med={editMed}
        onSave={updated => {
          updateMedication(updated)
          setEditMedOpen(false)
          showToast(t('pet.med.toastUpdated'))
        }}
        onDelete={id => {
          deleteMedication(id)
          setEditMedOpen(false)
          showToast(t('pet.med.toastDeleted'))
        }}
      />

      <NoteDetailModal
        note={noteDetail}
        onClose={() => setNoteDetail(null)}
        onEdit={n => { setNoteDetail(null); setEditNote(n); setEditNoteOpen(true) }}
        onArchive={id   => { setLocalNotes(p => p.map(n => n.id === id ? { ...n, archived: true }  : n)); setNoteDetail(null); showToast(t('pet.notes.toastArchived'))  }}
        onUnarchive={id => { setLocalNotes(p => p.map(n => n.id === id ? { ...n, archived: false } : n)); setNoteDetail(null); showToast(t('pet.notes.toastRestored'))  }}
        onDelete={id    => { setLocalNotes(p => p.filter(n => n.id !== id));                               setNoteDetail(null); showToast(t('pet.notes.toastDeleted'))   }}
      />
      <EditNoteModal
        isOpen={editNoteOpen}
        onClose={() => setEditNoteOpen(false)}
        note={editNote}
        onSave={updated => {
          setLocalNotes(p => p.map(n => n.id === updated.id ? updated : n))
          setEditNoteOpen(false)
          showToast(t('pet.notes.toastUpdated'))
        }}
      />

      {/* ── History detail overlay ── */}
      {histDetail && (
        <div className="detail-overlay" onClick={() => setHistDetail(null)}>
          <div className="detail-sheet" onClick={e => e.stopPropagation()}>
            <div className="detail-header">
              <div className="detail-icon" style={{
                background: histDetail.cls === 'vaccine' ? 'var(--blue-hl)' : histDetail.cls === 'med' ? 'var(--warn-hl)' : 'var(--primary-hl)',
                color:      histDetail.cls === 'vaccine' ? 'var(--blue)'    : histDetail.cls === 'med' ? 'var(--warn)'    : 'var(--primary)',
                fontSize: '1.375rem',
              }}>{histDetail.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1.2 }}>{histDetail.title}</div>
                <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>{histDetail.meta}</div>
              </div>
              <button className="detail-close" onClick={() => setHistDetail(null)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="detail-body">
              <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="status-pill ok">{histDetail.time}</span>
                <span className="badge badge-blue" style={{ fontSize: '.72rem' }}>
                  {histDetail.cls === 'vaccine' ? `💉 ${t('pet.tabs.vaccines')}` : histDetail.cls === 'med' ? `💊 ${t('pet.tabs.medications')}` : `📋 ${t('pet.tabs.notes')}`}
                </span>
              </div>
              <div className="detail-info-grid">
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('pet.history.event')}</div>
                  <div className="detail-info-value">{histDetail.title}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('pet.history.detail')}</div>
                  <div className="detail-info-value">{histDetail.meta}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('pet.history.date')}</div>
                  <div className="detail-info-value">{histDetail.time}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">{t('pet.history.pet')}</div>
                  <div className="detail-info-value">{SPECIES_EMOJI[petData.species] ?? '🐾'} {petData.name}</div>
                </div>
              </div>
            </div>
            <div className="detail-footer">
              {histDetail.cls === 'vaccine' && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  setActiveTab(1); setHistDetail(null)
                  showToast(t('pet.history.toastGoVaccines'))
                }}>
                  ✏ {t('pet.history.goVaccines')}
                </button>
              )}
              {histDetail.cls === 'med' && histDetail.medId && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  const m = localMeds.find(x => x.id === histDetail.medId)
                  if (m) { setEditMed(m); setEditMedOpen(true); setHistDetail(null) }
                }}>✏ {t('pet.history.editMed')}</button>
              )}
              {histDetail.cls === 'note' && histDetail.noteId && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  const n = localNotes.find(x => x.id === histDetail.noteId)
                  if (n) { setEditNote(n); setEditNoteOpen(true); setHistDetail(null) }
                }}>✏ {t('pet.history.editNote')}</button>
              )}
              <button className="btn btn-secondary" onClick={() => setHistDetail(null)}>
                {t('btn.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
