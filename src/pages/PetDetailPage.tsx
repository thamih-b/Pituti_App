// traduzido — sem mock, sem extraVacc local

import { useState, useRef, useMemo } from 'react'
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
import NewNoteModal, { type NoteData } from '../components/NewNoteModal'
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

// ─── Register Vaccine Modal ───────────────────────────────────────────────────

export function RegisterVaccineModal({ petName, isOpen, onClose, vaccines, onRegister }: {
  petName: string; isOpen: boolean; onClose: () => void
  vaccines: VaccineRecord[]
  onRegister: (v: { name: string; date: string; nextDate: string; vet: string; notes: string }) => void
}) {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm]       = useState({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.selected) e.selected = t('pet.vacc.errSelect')
    if (!form.date)     e.date     = t('pet.vacc.errDate')
    if (!form.nextDate) e.next     = t('pet.vacc.errNext')
    else if (new Date(form.nextDate) <= new Date(form.date)) e.next = t('pet.vacc.errNextAfter')
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSuccess(true)
    setTimeout(() => {
      onRegister({ name: form.selected, date: form.date, nextDate: form.nextDate, vet: form.vet, notes: form.notes })
      showToast(`💉 "${form.selected}" ${t('pet.vacc.toastRegistered')}`)
      setSuccess(false)
      setForm({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
      setErrors({})
      onClose()
    }, 1000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title={t('pet.vacc.modalTitle')}
      subtitle={t('pet.vacc.modalSubtitle', { name: petName })}
      icon="💉" accentBg="var(--blue-hl)" accentFg="var(--blue)"
      footer={!success
        ? <PfFooter><PfBtn variant="register" onClick={handleSave}>{t('pet.vacc.registerBtn')}</PfBtn></PfFooter>
        : <></>}>
      {success
        ? <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <div className="modal-success-title">{t('pet.vacc.successTitle')}</div>
            <div className="modal-success-sub">{t('pet.vacc.successSub', { name: petName })}</div>
          </div>
        : <>
            <div className="modal-section">{t('pet.vacc.sectionVaccine')}</div>
            <div className="form-group">
              <label className="form-label">{t('pet.vacc.selectLabel')} *</label>
              <select className={['form-input', errors.selected ? 'form-input--err' : ''].join(' ')}
                value={form.selected} onChange={e => set('selected', e.target.value)}>
                <option value="">{t('pet.vacc.selectPh')}</option>
                {vaccines.map(vacc => <option key={vacc.name} value={vacc.name}>{vacc.name}</option>)}
              </select>
              {errors.selected && <span className="form-hint-err">{errors.selected}</span>}
            </div>
            <div className="modal-section">{t('pet.vacc.sectionDates')}</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('pet.vacc.dateApplied')} *</label>
                <input type="date" className={['form-input', errors.date ? 'form-input--err' : ''].join(' ')}
                  value={form.date} onChange={e => set('date', e.target.value)} />
                {errors.date && <span className="form-hint-err">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">{t('pet.vacc.dateNext')} *</label>
                <input type="date" className={['form-input', errors.next ? 'form-input--err' : ''].join(' ')}
                  value={form.nextDate} onChange={e => set('nextDate', e.target.value)} />
                {errors.next && <span className="form-hint-err">{errors.next}</span>}
              </div>
            </div>
            <div className="modal-section">{t('pet.vacc.sectionExtra')}</div>
            <div className="form-group">
              <label className="form-label">{t('field.vet')} ({t('btn.optional')})</label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input className="form-input" placeholder={t('pet.vacc.vetPh')}
                  value={form.vet} onChange={e => set('vet', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('field.notes')} ({t('btn.optional')})</label>
              <textarea className="form-input" rows={2} value={form.notes}
                onChange={e => set('notes', e.target.value)}
                style={{ resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
            </div>
          </>}
    </Modal>
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

function TabVaccines({ petId, petName }: { petId: string; petName: string }) {
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

  const handleRegister = (v: { name: string; date: string; nextDate: string; vet: string; notes: string }) => {
    const lbl = new Date(v.date + 'T12:00:00').toLocaleDateString(undefined, {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    const cls = getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late'
    addVaccine(petId, {
      id: '', name: v.name, applied: lbl, nextDate: v.nextDate,
      badge: VACC_BADGE[cls].badge, badgeCls: VACC_BADGE[cls].cls,
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
                      {vacc.cls === 'late'
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

      <RegisterVaccineModal petName={petName} isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister} />

      <VaccineDetailModal
        vaccine={vaccDetail ? { ...vaccDetail, petName, petEmoji: SPECIES_EMOJI[petId] ?? '🐾' } : null}
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

  // ── Todos os useState/useMemo/hooks ANTES de qualquer return condicional ──
  const [activeTab,      setActiveTab]      = useState(0)
  const [shareOpen,      setShareOpen]      = useState(false)
  const [editOpen,       setEditOpen]       = useState(false)
  const [addMedOpen,     setAddMedOpen]     = useState(false)
  const [addNoteOpen,    setAddNoteOpen]    = useState(false)
  const [addSymptomOpen, setAddSymptomOpen] = useState(false)
  const [chipField,      setChipField]      = useState<ChipField | null>(null)

  const petData = useMemo<(PetWithAlerts & { weight?: number | string | null }) | null>(() => {
    if (!petId || pets.length === 0) return null
    return (pets.find(p => p.id === petId) as PetWithAlerts & { weight?: number | string | null } | undefined) ?? null
  }, [pets, petId])

  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    if (!petId) return null
    try { return localStorage.getItem(`pet-photo-${petId}`) ?? null } catch { return null }
  })

  const { addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const safePetId = petData?.id ?? ''
  const { active: activeSymptoms, resolved: resolvedSymptoms } = usePetSymptoms(safePetId)

  const [detailSym, setDetailSym] = useState<SymptomEntry | null>(null)
  const [editSym,   setEditSym]   = useState<SymptomEntry | null>(null)
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

  // FIX: histDetail estava DEPOIS dos returns condicionais → React error #310
  const [histDetail, setHistDetail] = useState<{
    cls: string; icon: string; title: string; meta: string; time: string
    medId?: string; noteId?: string
  } | null>(null)

  // FIX: useVaccinesContext estava DEPOIS dos returns condicionais → React error #310
  const { vaccinesByPet } = useVaccinesContext()

  // ── Returns condicionais APÓS todos os hooks ───────────────────────────────
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

  // ── daqui para baixo petData é non-null ────────────────────────────────────

  const NOTE_LABEL: Record<string, string> = {
    control:     t('pet.noteType.control'),
    observacion: t('pet.noteType.observacion'),
    emergencia:  t('pet.noteType.emergencia'),
    vacuna:      t('pet.noteType.vacuna'),
    cirugia:     t('pet.noteType.cirugia'),
    otro:        t('pet.noteType.otro'),
  }

  const TABS = [
    `🐾 ${t('pet.tabs.cares')}`,
    t('pet.tabs.vaccines'),
    t('pet.tabs.medications'),
    t('pet.tabs.symptoms'),
    t('pet.tabs.notes'),
    t('pet.tabs.history'),
  ]

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const r = ev.target?.result as string
      if (r) {
        setPhotoUrl(r)
        try { localStorage.setItem('pet-photo-' + petData.id, r) } catch {}
        showToast(t('pet.toastPhoto'))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChipSave = (_updated: Partial<PetWithAlerts>) => {
    setChipField(null)
  }

  // FIX: histItems useMemo agora seguro (todos os hooks já foram chamados)
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

  const SEV_COLOR: Record<string, string> = { leve: 'var(--gold)', moderado: 'var(--warn)', grave: 'var(--err)', emergencia: 'var(--err)' }
  const SEV_BG: Record<string, string>    = { leve: 'var(--gold-hl)', moderado: 'var(--warn-hl)', grave: 'var(--err-hl)', emergencia: 'var(--err-hl)' }
  const CAT_ICON: Record<string, string>  = { digestivo: '🤢', respiratorio: '🫁', piel: '🩹', comportamiento: '🧠', movimiento: '🦶', ocular: '👁', otro: '❓' }

  return (
    <div>
      {/* Header do pet */}
      <div className="pet-detail-header">
        <div className="pet-detail-photo-wrap" onClick={() => photoRef.current?.click()}>
          {photoUrl
            ? <img src={photoUrl} alt={petData.name} className="pet-detail-photo" />
            : <div className="pet-detail-photo-placeholder">
                {SPECIES_EMOJI[petData.species] ?? '🐾'}
              </div>}
          <div className="pet-detail-photo-overlay">📷</div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />

        <div className="pet-detail-info">
          <h1 className="pet-detail-name">{petData.name}</h1>
          <div className="pet-detail-chips">
            {petData.species && (
              <span className="pet-chip-readonly" onClick={() => setChipField('species')}>
                {SPECIES_EMOJI[petData.species]} {petData.species}
              </span>
            )}
            {petData.birthDate && (
              <span className="pet-chip-readonly" onClick={() => setChipField('birthDate')}>
                🎂 {petData.birthDate}
              </span>
            )}
            {petData.weight && (
              <span className="pet-chip-readonly" onClick={() => setChipField('weight')}>
                ⚖️ {petData.weight} kg
              </span>
            )}
          </div>
          <div className="pet-detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setEditOpen(true)}>
              ✏️ {t('btn.edit')}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShareOpen(true)}>
              👥 {t('pet.share.shareBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.25rem', overflowX: 'auto' }}>
        {TABS.map((tab, i) => (
          <button key={i} type="button"
            className={`tab${activeTab === i ? ' active' : ''}`}
            onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <TabCares petId={petData.id} petName={petData.name} />}
      {activeTab === 1 && <TabVaccines petId={petData.id} petName={petData.name} />}

      {activeTab === 2 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setAddMedOpen(true)}>
              + {t('medications.add')}
            </button>
          </div>
          {localMeds.length === 0
            ? <div className="empty-state">
                <div className="empty-state-icon">💊</div>
                <p>{t('medications.emptyActive')}</p>
              </div>
            : localMeds.map(m => (
                <div key={m.id} className="list-item" onClick={() => setMedDetail(m)} style={{ cursor: 'pointer' }}>
                  <div className="list-item-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
                  <div className="list-item-info">
                    <div className="list-item-title">{m.title}</div>
                    <div className="list-item-sub">{m.dose} · {m.frequency}</div>
                  </div>
                  <span className={`badge ${m.badgeCls}`}>{m.badge}</span>
                </div>
              ))
          }
        </div>
      )}

      {activeTab === 3 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setAddSymptomOpen(true)}>
              + {t('symptoms.register')}
            </button>
          </div>
          {[...activeSymptoms, ...resolvedSymptoms].map(s => (
            <div key={s.id} className="list-item" onClick={() => setDetailSym(s)} style={{ cursor: 'pointer', opacity: s.resolved ? .7 : 1 }}>
              <div className="list-item-icon" style={{ background: SEV_BG[s.severity] ?? 'var(--err-hl)', color: SEV_COLOR[s.severity] ?? 'var(--err)' }}>
                {CAT_ICON[s.category] ?? '🌡️'}
              </div>
              <div className="list-item-info">
                <div className="list-item-title">{s.description.slice(0, 40)}</div>
                <div className="list-item-sub">{s.date} · {s.severity}</div>
              </div>
              <span className={`badge ${s.resolved ? 'badge-gray' : 'badge-red'}`}>
                {s.resolved ? t('pet.symptoms.statusResolved') : t('pet.symptoms.statusActive')}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 4 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setAddNoteOpen(true)}>
              + {t('pet.notes.addBtn')}
            </button>
          </div>
          {localNotes.length === 0
            ? <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <p>{t('pet.notes.empty')}</p>
              </div>
            : localNotes.map(n => (
                <div key={n.id} className="list-item" onClick={() => setNoteDetail(n)} style={{ cursor: 'pointer' }}>
                  <div className="list-item-icon" style={{ background: NOTE_BG[n.type] ?? 'var(--surface-offset)', color: NOTE_COLOR[n.type] ?? 'var(--text-muted)' }}>
                    {NOTE_ICON[n.type] ?? '📋'}
                  </div>
                  <div className="list-item-info">
                    <div className="list-item-title">{n.content.slice(0, 50)}</div>
                    <div className="list-item-sub">{n.date}</div>
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {activeTab === 5 && (
        <div>
          <div className="timeline">
            {histItems.slice(0, 20).map((item, i) => (
              <div key={i} className="timeline-item" style={{ cursor: item.medId || item.noteId ? 'pointer' : 'default' }}
                onClick={() => {
                  if (item.medId) setMedDetail(localMeds.find(m => m.id === item.medId) ?? null)
                  if (item.noteId) setNoteDetail(localNotes.find(n => n.id === item.noteId) ?? null)
                }}>
                <div className={`tl-icon ${item.cls}`}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="tl-title">{item.title}</div>
                  <div className="tl-meta">{item.meta}</div>
                </div>
                <div className="tl-time">{item.time}</div>
              </div>
            ))}
            {histItems.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p>{t('pet.history.empty')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <ShareModal petName={petData.name} isOpen={shareOpen} onClose={() => setShareOpen(false)} />

      <EditPetModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        pet={petData}
        onSave={(updated) => {
          updatePet(petData.id, updated)
          setEditOpen(false)
        }}
      />

      {chipField && (
        <PetChipEditOverlay
          pet={petData}
          field={chipField}
          onClose={() => setChipField(null)}
          onSave={handleChipSave}
        />
      )}

      <AddMedicationModal
        isOpen={addMedOpen}
        onClose={() => setAddMedOpen(false)}
        defaultPetId={petData.id}
        onAdd={(data: AddMedData) => {
          addMedication(data.petId, {
            petId:     data.petId,
            title:     data.name,
            dose:      data.dose,
            frequency: data.frequency,
            startDate: data.startDate,
            endDate:   data.endDate  ?? '',
            notes:     data.notes    ?? '',
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
          showToast(`🌡️ ${t('pet.symptoms.toastAdded')}`)
          setAddSymptomOpen(false)
        }}
      />

      <NewNoteModal
        isOpen={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        defaultPetId={petData.id}
        onAdd={(data: NoteData) => {
          const newNote: NoteEntry = { ...data, id: Date.now().toString(), archived: false }
          setLocalNotes(prev => [newNote, ...prev])
          showToast(`📝 ${t('pet.notes.toastAdded')}`)
          setAddNoteOpen(false)
        }}
      />

      <SymptomDetailModal
        symptom={detailSym}
        onClose={() => setDetailSym(null)}
        onEdit={s => { setDetailSym(null); setEditSym(s); setEditSymOpen(true) }}
        onResolve={id => { resolve(id); showToast(`✓ ${t('toast.symptomResolved')}`) }}
        onUnresolve={id => { unresolve(id); showToast(`↩ ${t('toast.symptomReopened')}`) }}
      />
      <EditSymptomModal
        isOpen={editSymOpen}
        onClose={() => setEditSymOpen(false)}
        symptom={editSym}
        onSave={updated => { saveSymptom(updated); setEditSymOpen(false) }}
      />

      <MedDetailModal
        med={medDetail}
        onClose={() => setMedDetail(null)}
        onEdit={m => { setMedDetail(null); setEditMed(m); setEditMedOpen(true) }}
        onMarkAdministered={() => {}}
      />
      <EditMedModal
        isOpen={editMedOpen}
        onClose={() => setEditMedOpen(false)}
        med={editMed}
        onSave={updated => { updateMedication(updated); setEditMedOpen(false) }}
        onDelete={id => { deleteMedication(id); setEditMedOpen(false) }}
      />

      <NoteDetailModal
        note={noteDetail}
        onClose={() => setNoteDetail(null)}
        onEdit={n => { setNoteDetail(null); setEditNote(n); setEditNoteOpen(true) }}
        onArchive={id => { setNoteDetail(null) }}
        onUnarchive={id => { setNoteDetail(null) }}
      />
      <EditNoteModal
        isOpen={editNoteOpen}
        onClose={() => setEditNoteOpen(false)}
        note={editNote}
        onSave={updated => {
          setLocalNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
          setEditNoteOpen(false)
        }}

      />
    </div>
  )
}