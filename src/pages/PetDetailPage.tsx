import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_PETS, SPECIES_EMOJI, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord, PetWithAlerts } from '../hooks/usePets'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import VaccRing from '../components/VaccRing'
import AddCareModal from '../components/AddCareModal'
import AddMedicationModal from '../components/AddMedicationModal'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import NewNoteModal from '../components/NewNoteModal'
import EditPetModal from '../components/EditPetModal'
import EditCareModal from '../components/EditCareModal'
import PetChipEditOverlay from '../components/PetChipEditOverlay'
import { PfBtn, PfFooter } from '../components/FooterButtons'
import InviteSentOverlay from '../components/InviteSentOverlay'
import type { AddMedData } from '../components/AddMedicationModal'
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
import { useMedications } from '../context/MedicationsContext'


type ChipField = 'species' | 'birthDate' | 'weight' | 'caregivers'

const NOTE_ICON: Record<string, string> = { control: '🩺', observacion: '📝', emergencia: '🚨', vacuna: '💉', cirugia: '🏥', otro: '📋' }
const NOTE_BG: Record<string, string>   = { control: 'var(--blue-hl)', observacion: 'var(--primary-hl)', emergencia: 'var(--err-hl)', vacuna: 'var(--success-hl)', cirugia: 'var(--warn-hl)', otro: 'var(--surface-offset)' }
const NOTE_COLOR: Record<string, string>= { control: 'var(--blue)', observacion: 'var(--primary)', emergencia: 'var(--err)', vacuna: 'var(--success)', cirugia: 'var(--warn)', otro: 'var(--text-muted)' }
const NOTE_LABEL: Record<string, string>= { control: 'Control', observacion: 'Observación', emergencia: 'Emergencia', vacuna: 'Post-vacuna', cirugia: 'Cirugía', otro: 'Nota' }


function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className="toggle-pill" style={{ background: on ? 'var(--primary)' : 'var(--border)' }} onClick={() => onChange(!on)}>
      <span className="toggle-pill-thumb" style={{ left: on ? 22 : 2 }} />
    </button>
  )
}


/* ── REGISTER VACCINE MODAL (exported) ── */
export function RegisterVaccineModal({ petName, isOpen, onClose, vaccines, onRegister }: {
  petName: string; isOpen: boolean; onClose: () => void
  vaccines: VaccineRecord[]
  onRegister: (v: { name: string; date: string; nextDate: string; vet: string; notes: string }) => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const set = (k: keyof typeof form, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }
  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.selected) e.selected = 'Selecciona una vacuna'
    if (!form.date) e.date = 'Fecha obligatoria'
    if (!form.nextDate) e.next = 'Próxima dosis obligatoria'
    else if (new Date(form.nextDate) <= new Date(form.date)) e.next = 'Debe ser posterior'
    return e
  }
  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSuccess(true)
    setTimeout(() => {
      onRegister({ name: form.selected, date: form.date, nextDate: form.nextDate, vet: form.vet, notes: form.notes })
      showToast(`💉 "${form.selected}" registrada`)
      setSuccess(false)
      setForm({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
      setErrors({})
      onClose()
    }, 1000)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar vacuna" subtitle={`Aplicación en ${petName}`}
      icon="💉" accentBg="var(--blue-hl)" accentFg="var(--blue)"
      footer={!success
        ? <PfFooter><PfBtn variant="register" onClick={handleSave}>Registrar aplicación</PfBtn></PfFooter>
        : <></>}>
      {success
        ? <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <div className="modal-success-title">¡Registrado!</div>
            <div className="modal-success-sub">Vacuna añadida al historial de {petName}</div>
          </div>
        : <>
            <div className="modal-section">Vacuna</div>
            <div className="form-group">
              <label className="form-label">Seleccionar *</label>
              <select className={['form-input', errors.selected ? 'form-input--err' : ''].join(' ')} value={form.selected} onChange={e => set('selected', e.target.value)}>
                <option value="">Elige…</option>
                {vaccines.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
              {errors.selected && <span className="form-hint-err">{errors.selected}</span>}
            </div>
            <div className="modal-section">Fechas</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Aplicación *</label>
                <input type="date" className={['form-input', errors.date ? 'form-input--err' : ''].join(' ')} value={form.date} onChange={e => set('date', e.target.value)} />
                {errors.date && <span className="form-hint-err">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Próxima *</label>
                <input type="date" className={['form-input', errors.next ? 'form-input--err' : ''].join(' ')} value={form.nextDate} onChange={e => set('nextDate', e.target.value)} />
                {errors.next && <span className="form-hint-err">{errors.next}</span>}
              </div>
            </div>
            <div className="modal-section">Info adicional</div>
            <div className="form-group">
              <label className="form-label">Veterinario (opcional)</label>
              <div className="field-icon-wrap"><span className="field-icon">🩺</span><input className="form-input" placeholder="Dra. García" value={form.vet} onChange={e => set('vet', e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Notas (opcional)</label>
              <textarea className="form-input" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
            </div>
          </>}
    </Modal>
  )
}


/* ── SHARE MODAL ── */
function ShareModal({ petName, isOpen, onClose }: { petName: string; isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('caregiver')
  const [emailErr, setEmailErr] = useState('')
  const [caregivers, setCaregivers] = useState([
    { id: 'tl', initials: 'TL', name: 'Thamires Lopes', role: 'Propietaria · acceso completo', bg: 'var(--pal-lilac)', color: 'var(--nav-bg)', badge: 'Tú', removable: false },
    { id: 'am', initials: 'AM', name: 'Ana Martínez', role: 'Cuidadora · puede registrar', bg: 'var(--blue-hl)', color: 'var(--blue)', badge: null as string | null, removable: true },
  ])
  const [inviteSent, setInviteSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const ACCESS = [
    { val: 'readonly', icon: '👁', label: 'Solo lectura', sub: 'Ver registros' },
    { val: 'caregiver', icon: '✏️', label: 'Cuidador', sub: 'Registrar cuidados y vacunas' },
    { val: 'full', icon: '⚙️', label: 'Acceso completo', sub: 'Editar perfil y todos los datos' },
  ]
  const handleInvite = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setEmailErr('Introduce un email válido'); return }
    const initials = email.split('@')[0].slice(0, 2).toUpperCase()
    const roleLabel = ACCESS.find(a => a.val === role)?.label ?? role
    setCaregivers(p => [...p, { id: Date.now().toString(), initials, name: email, role: roleLabel, bg: 'var(--gold-hl)', color: 'var(--gold)', badge: null, removable: true }])
    setSentEmail(email); setEmail(''); setEmailErr(''); setInviteSent(true)
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Compartir cuidados" subtitle={`Invita a cuidadores de ${petName}`}
        icon="👥" accentBg="var(--blue-hl)" accentFg="var(--blue)" size="md"
        footer={<PfFooter><PfBtn variant="add" onClick={handleInvite}>Enviar invitación</PfBtn></PfFooter>}>
        <div className="modal-section">Cuidadores activos <span className="badge badge-gray">{caregivers.length}</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '.5rem' }}>
          {caregivers.map(u => (
            <div key={u.id} className="caregiver-row">
              <div className="caregiver-row-avatar" style={{ background: u.bg, color: u.color }}>{u.initials}</div>
              <div style={{ flex: 1 }}><div className="caregiver-row-name">{u.name}</div><div className="caregiver-row-role">{u.role}</div></div>
              {u.badge
                ? <span className="badge badge-green">{u.badge}</span>
                : <PfBtn variant="delete" size="sm" onClick={() => { setCaregivers(p => p.filter(c => c.id !== u.id)); showToast('Cuidador eliminado') }}>Eliminar</PfBtn>}
            </div>
          ))}
        </div>
        <div className="modal-section">Invitar nuevo cuidador</div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Email *</label>
          <div className="field-icon-wrap" style={{ width: '100%' }}>
            <span className="field-icon">✉</span>
            <input className={['form-input', emailErr ? 'form-input--err' : ''].join(' ')} type="email" placeholder="nombre@email.com"
              value={email} onChange={e => { setEmail(e.target.value); setEmailErr('') }} style={{ width: '100%' }} />
          </div>
          {emailErr && <span className="form-hint-err">{emailErr}</span>}
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Nivel de acceso</label>
          <div className="access-options">
            {ACCESS.map(a => (
              <div key={a.val} className={['access-option', role === a.val ? 'selected' : ''].join(' ')} onClick={() => setRole(a.val)}>
                <div className="access-option-icon">{a.icon}</div>
                <div style={{ flex: 1 }}><div className="access-option-label">{a.label}</div><div className="access-option-sub">{a.sub}</div></div>
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


/* ── TAB CARES ── */
function TabCares({ petId, petName }: { petId: string; petName: string }) {
  const petItems = usePetCares(petId)
  const { addCare, editCare, deleteCare, setCareProgress } = useCares()
  const today = new Date().toISOString().split('T')[0]

  // Cuidados de hoje
  const daily = petItems.filter(i => isDueOnDate(i, today))

  // Próximos (cada X dias, não hoje)
  const scheduled = petItems
    .filter(i => i.intervalDays > 1 && !isDueOnDate(i, today))
    .map(i => ({ item: i, nextDate: getNextDueDate(i, today) }))
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate))

  const [editItem, setEditItem] = useState<CareEditData | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Cuidados de hoy</div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {daily.filter(i => getDone(i).doneState).length} de {daily.length} completados
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Añadir
        </button>
      </div>

      {/* Care grid — usa context */}
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
                    ? <span style={{ color: 'var(--success)' }}>Hecho ✓</span>
                    : `${d.done}/${item.total}`}
                </span>
              </div>
              <div className="care-actions" onClick={e => e.stopPropagation()}>
                <button
                  className={`care-btn-do ${d.doneState ? 'done-btn' : ''}`}
                  onClick={() => {
                    const ns = !getDone(item).doneState
                    setCareProgress(item.id, today, ns ? item.total : 0, ns)
                    showToast(ns ? `✓ ${item.title} completado` : `↩ ${item.title} desmarcado`)
                  }}>
                  {d.doneState ? 'Hecho ✓' : 'Registrar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Secção próximos cuidados */}
      {scheduled.length > 0 && (
        <div style={{
          marginTop: '1rem', background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)', padding: '.875rem 1rem',
        }}>
          <div style={{
            fontSize: '.75rem', fontWeight: 800, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '.25rem',
          }}>
            📅 Próximos cuidados programados
          </div>
          {scheduled.map(({ item, nextDate }) => {
            const daysFromNow = Math.round(
              (new Date(nextDate + 'T00:00:00').getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000
            )
            const dateLabel = new Date(nextDate + 'T12:00:00').toLocaleDateString('es-ES', {
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
                    {daysFromNow === 0 ? 'Hoy' : `en ${daysFromNow}d`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
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

      {/* Edit modal — sincronizado com CaresContext */}
      <EditCareModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        care={editItem}
        onSave={updated => {
          const item = petItems.find(i => i.id === updated.id)
          if (!item) return
          editCare({
            ...item,
            emoji: updated.emoji,
            title: updated.title,
            total: updated.total,
            period: updated.period ?? 'day',
            quantity: updated.quantity ?? '',
            notify: updated.notify,
            sub: `${updated.total}× ${updated.period === 'day' ? 'día' : 'semana'}${updated.quantity ? ' · ' + updated.quantity : ''}`,
            time: updated.time ?? '',
            intervalDays: updated.intervalDays ?? 1,
            recurring: updated.recurring ?? true,
          })
          showToast(`${updated.emoji} ${updated.title} actualizado`)
          setEditOpen(false)
        }}
        onDelete={id => {
          deleteCare(id)
          setEditOpen(false)
          showToast('Cuidado eliminado')
        }}
      />

      {/* Add modal */}
      <AddCareModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        defaultPetId={petId}
        onAdd={d => {
          addCare({
            petId: d.petId,
            emoji: d.emoji,
            title: d.title,
            sub: `${d.total}× ${d.period === 'day' ? 'día' : 'semana'}${d.quantity ? ' · ' + d.quantity : ''}`,
            total: d.total,
            period: d.period ?? 'day',
            quantity: d.quantity,
            notify: d.notify,
            bg: '',
            time: d.time ?? '',
            intervalDays: d.intervalDays ?? 1,
            recurring: d.recurring ?? true,
            startDate: today,
          })
          showToast(`${d.emoji} ${d.title} añadido`)
        }}
      />
    </>
  )
}


/* ── TAB VACCINES (compact) ── */
function TabVaccines({ petId, petName }: { petId: string; petName: string }) {
  const [registerOpen, setRegisterOpen] = useState(false)
  const [extraVacc, setExtraVacc] = useState<VaccineRecord[]>([])
  const [vaccDetail, setVaccDetail] = useState<(VaccineRecord & { cls: 'ok' | 'soon' | 'late' }) | null>(null)
  const [editVacc, setEditVacc] = useState<VaccineRecord | null>(null)
  const [editVaccOpen, setEditVaccOpen] = useState(false)
  const base = VACCINES_BY_PET[petId] ?? []
  const vaccines = [...base, ...extraVacc]
  const withStatus = vaccines.map(v => ({ ...v, cls: getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late' }))
  const okCount = withStatus.filter(v => v.cls === 'ok').length
  const alDia = withStatus.filter(v => v.cls === 'ok' || v.cls === 'soon').length
  const pending = withStatus.filter(v => v.cls === 'soon' || v.cls === 'late').length
  const total = vaccines.length
  const cov = total > 0 ? Math.round(okCount / total * 100) : 100
  const alPct = total > 0 ? Math.round(alDia / total * 100) : 100
  const penPct = total > 0 ? Math.round(pending / total * 100) : 0

  const handleRegister = ({ name, date, nextDate }: { name: string; date: string; nextDate: string; vet: string; notes: string }) => {
    const lbl = new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    const cls = getVaccStatus(nextDate)
    setExtraVacc(prev => [...prev, {
      name, applied: lbl, nextDate,
      badge: cls === 'ok' ? 'AL DÍA' : cls === 'soon' ? 'POR VENCER' : 'VENCIDA',
      badgeCls: cls === 'ok' ? 'badge-green' : cls === 'soon' ? 'badge-yellow' : 'badge-red',
    }])
  }

  return (
    <>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            Vacunas
            <button className="btn btn-primary btn-sm" onClick={() => setRegisterOpen(true)}>💉 Registrar</button>
          </div>
          {withStatus.length === 0
            ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin vacunas</div>
            : withStatus.map(v => (
                <div key={v.name + v.nextDate} className="vaccine-row"
                  onClick={() => setVaccDetail(v)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.875rem', padding: '.75rem 0', borderBottom: '1.5px solid var(--divider)', cursor: 'pointer' }}>
                  <div className="vaccine-icon" style={{
                    background: v.cls === 'ok' ? 'var(--success-hl)' : v.cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
                    color: v.cls === 'ok' ? 'var(--success)' : v.cls === 'soon' ? 'var(--gold)' : 'var(--err)',
                  }}>💉</div>
                  <div style={{ flex: 1 }}>
                    <div className="vaccine-name">{v.name}</div>
                    <div className="vaccine-date">Aplicada {v.applied}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`vaccine-next ${v.cls}`}>
                      {v.cls === 'late'
                        ? `Vencida · ${new Date(v.nextDate + 'T12:00:00').toLocaleDateString('es-ES')}`
                        : `Próxima ${new Date(v.nextDate + 'T12:00:00').toLocaleDateString('es-ES')}`}
                    </div>
                    <span className={`badge ${v.badgeCls}`} style={{ fontSize: '.6rem' }}>{v.badge}</span>
                  </div>
                </div>
              ))}
        </div>
        <div className="card">
          <div className="card-title">Cobertura</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
            <VaccRing coverage={cov} size={96} strokeWidth={8} />
          </div>
          {[
            { label: 'Cobertura vacunal', pct: cov, color: '' },
            { label: 'Vacunas al día', pct: alPct, color: 'success' },
            { label: 'Pendientes/vencidas', pct: penPct, color: penPct > 0 ? 'warn' : 'success' },
          ].map(b => (
            <div key={b.label} style={{ marginBottom: '.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8125rem', marginBottom: '.375rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{b.label}</span>
                <span style={{ fontWeight: 700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width: `${b.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <RegisterVaccineModal petName={petName} isOpen={registerOpen} onClose={() => setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister} />
      <VaccineDetailModal
        vaccine={vaccDetail ? { ...vaccDetail, petName, petEmoji: SPECIES_EMOJI[petId] ?? '🐾' } : null}
        onClose={() => setVaccDetail(null)}
        onEdit={v => { setVaccDetail(null); setEditVacc(v); setEditVaccOpen(true) }}
        onMarkApplied={(v, appliedDate, nextDate) => {
          const lbl = new Date(appliedDate + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
          const cls = getVaccStatus(nextDate)
          const badge = cls === 'ok' ? 'AL DÍA' : cls === 'soon' ? 'POR VENCER' : 'VENCIDA'
          const badgeCls = cls === 'ok' ? 'badge-green' : cls === 'soon' ? 'badge-yellow' : 'badge-red'
          const updated: VaccineRecord = { ...v, applied: lbl, nextDate, badge, badgeCls }
          setExtraVacc(prev => {
            const exists = prev.find(x => x.name === v.name)
            return exists ? prev.map(x => x.name === v.name ? updated : x) : [...prev, updated]
          })
          setVaccDetail(null)
          showToast('💉 Aplicación registrada')
        }}
      />
      <EditVaccineModal
        isOpen={editVaccOpen}
        onClose={() => setEditVaccOpen(false)}
        vaccine={editVacc}
        onSave={updated => {
          setExtraVacc(prev => {
            const exists = prev.find(x => x.name === updated.name)
            return exists ? prev.map(x => x.name === updated.name ? updated : x) : [...prev, updated]
          })
          setEditVaccOpen(false)
          showToast('💉 Vacuna actualizada')
        }}
      />
    </>
  )
}


/* ══ PET DETAIL PAGE ══ */
const TABS = ['🐾 Cuidados', 'Vacunas', 'Medicamentos', 'Síntomas', 'Notas', 'Historial']

export default function PetDetailPage() {
  const { petId } = useParams<{ petId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [addMedOpen, setAddMedOpen] = useState(false)
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [addSymptomOpen, setAddSymptomOpen] = useState(false)
  const [chipField, setChipField] = useState<ChipField | null>(null)
  const [petData, setPetData] = useState<PetWithAlerts>(MOCK_PETS.find(p => p.id === petId) ?? MOCK_PETS[0])
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    try { return localStorage.getItem('pet-photo-' + (petId ?? MOCK_PETS[0].id)) } catch { return null }
  })

  // Synced symptoms
  const { addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const { active: activeSymptoms, resolved: resolvedSymptoms } = usePetSymptoms(petData.id)
  const [detailSym, setDetailSym] = useState<SymptomEntry | null>(null)
  const [editSym, setEditSym] = useState<SymptomEntry | null>(null)
  const [editSymOpen, setEditSymOpen] = useState(false)

  const photoRef = useRef<HTMLInputElement>(null)
const {
  getActiveMedicationsByPetId,
  addMedication,
  updateMedication,
  deleteMedication,
} = useMedications()

const localMeds = getActiveMedicationsByPetId(petData.id)
  const [medDetail, setMedDetail] = useState<MedRecord | null>(null)
  const [editMed, setEditMed] = useState<MedRecord | null>(null)
  const [editMedOpen, setEditMedOpen] = useState(false)
  const [localNotes, setLocalNotes] = useState<NoteEntry[]>([{
    id: 'note-1', petId: petData.id,
    content: `${petData.name} en buen estado. Peso estable. Revisar vacuna antirrábica.`,
    vet: 'Dra. Martínez', date: '2026-01-10', type: 'control', archived: false,
  }])
  const [noteDetail, setNoteDetail] = useState<NoteEntry | null>(null)
  const [editNote, setEditNote]     = useState<NoteEntry | null>(null)
  const [editNoteOpen, setEditNoteOpen] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const r = ev.target?.result as string
      if (r) {
        setPhotoUrl(r)
        try { localStorage.setItem('pet-photo-' + petData.id, r) } catch {}
        showToast('📸 Foto actualizada')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChipSave = (updated: Partial<PetWithAlerts>) => {
    setPetData(prev => ({ ...prev, ...updated }))
    setChipField(null)
  }

  type HistItem = { cls: string; icon: string; title: string; meta: string; time: string; medId?: string; noteId?: string }
  const [histDetail, setHistDetail] = useState<HistItem | null>(null)
  const SEV_COLOR: Record<string, string> = { leve: 'var(--gold)', moderado: 'var(--warn)', grave: 'var(--err)', emergencia: 'var(--err)' }
  const SEV_BG: Record<string, string> = { leve: 'var(--gold-hl)', moderado: 'var(--warn-hl)', grave: 'var(--err-hl)', emergencia: 'var(--err-hl)' }
  const CAT_ICON: Record<string, string> = { digestivo: '🤢', respiratorio: '🫁', piel: '🩹', comportamiento: '🧠', movimiento: '🦶', ocular: '👁', otro: '❓' }

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }} onClick={() => navigate('/pets')}>← Mis mascotas</button>

      {/* Pet hero */}
      <div className="pet-profile-hero">
        <div className="pet-photo-wrap">
          <div className="pet-photo-circle">
            {photoUrl ? <img src={photoUrl} alt={petData.name} /> : <span>{SPECIES_EMOJI[petData.species] ?? '🐾'}</span>}
          </div>
          <button className="pet-photo-btn" onClick={() => photoRef.current?.click()} title="Cambiar foto">📷</button>
          <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>{petData.name}</h1>
            <span style={{ fontSize: '1.1rem' }}>{SPECIES_EMOJI[petData.species]}</span>
            <span className="badge badge-green" style={{ marginLeft: '.25rem' }}>Saludable</span>
          </div>
          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>{petData.breed ?? 'Raza desconocida'} · 4 años</p>
          <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
            {petData.alerts.map((a, i) => (
              <span key={i} className={`badge ${a.type === 'err' ? 'badge-red' : 'badge-yellow'}`}>
                {a.type === 'warn' ? '⚠️' : '🔴'} {a.text.slice(0, 28)}…
              </span>
            ))}
            <span className="badge badge-blue">💊 Med. activo</span>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setEditOpen(true)}>✏ Editar</button>
      </div>

      {/* Clickable stat chips */}
      <div className="stat-row">
        {([
          { label: 'Especie', field: 'species' as ChipField, value: petData.species === 'cat' ? 'Gato 🐱' : petData.species === 'dog' ? 'Perro 🐶' : 'Ave 🦜' },
          { label: 'Nacimiento', field: 'birthDate' as ChipField, value: petData.birthDate ? new Date(petData.birthDate + 'T12:00:00').toLocaleDateString('es-ES') : '—' },
          { label: 'Peso', field: 'weight' as ChipField, value: petData.species === 'cat' ? '4.2 kg' : petData.species === 'dog' ? '12.4 kg' : '32 g' },
          { label: 'Cuidadores', field: 'caregivers' as ChipField, value: null },
        ] as const).map(s => (
          <div key={s.label} className="stat-chip clickable" onClick={() => setChipField(s.field)} title={`Editar ${s.label}`}>
            <span className="stat-chip-edit-hint">✏</span>
            <div className="stat-chip-label">{s.label}</div>
            {s.value
              ? <div className="stat-chip-value" style={{ fontSize: '1rem' }}>{s.value}</div>
              : <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem' }}>TL</div>
                  {petData.id === 'pet-1' && <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem', background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
                </div>}
          </div>
        ))}
      </div>

      {/* Caregivers bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '1.125rem', padding: '.75rem 1rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-sm)' }}>
        <span style={{ fontSize: '.8125rem', fontWeight: 700, color: 'var(--text-muted)', flex: 1 }}>Cuidadores compartidos</span>
        <div className="caregiver-avatars">
          <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem' }}>TL</div>
          {petData.id === 'pet-1' && <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem', background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShareOpen(true)}>👥 Compartir</button>
      </div>

      <div className="tabs">
        {TABS.map((t, i) => <div key={t} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>)}
      </div>

      {activeTab === 0 && <TabCares petId={petData.id} petName={petData.name} />}
      {activeTab === 1 && <TabVaccines petId={petData.id} petName={petData.name} />}

      {activeTab === 2 && (
        <div className="card">
          <div className="card-title">
            Medicamentos activos
            <button className="btn btn-primary btn-sm" onClick={() => setAddMedOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Añadir
            </button>
          </div>
          {localMeds.map(m => (
            <div key={m.id} className="list-item" onClick={() => setMedDetail(m)} style={{ cursor: 'pointer' }}>
              <div className="list-item-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
              <div className="list-item-info">
                <div className="list-item-title">{m.title}</div>
                <div className="list-item-sub">{[m.dose, m.frequency].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="list-item-right"><span className={`badge ${m.badgeCls}`}>{m.badge}</span></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 3 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Síntomas de {petData.name}</div>
            <button className="btn btn-primary btn-sm" onClick={() => setAddSymptomOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Registrar
            </button>
          </div>
          {activeSymptoms.length === 0 && resolvedSymptoms.length === 0
            ? <div className="empty-state" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🐾</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '.375rem' }}>{petData.name} está bien</div>
                <div style={{ fontSize: '.875rem', marginBottom: '1.25rem' }}>Registra cualquier cambio de comportamiento aquí.</div>
              </div>
            : <div className="grid-2">
                <div className="card">
                  <div className="card-title">Activos {activeSymptoms.length > 0 && <span className="badge badge-red">{activeSymptoms.length}</span>}</div>
                  {activeSymptoms.length === 0
                    ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin síntomas activos ✓</div>
                    : activeSymptoms.map(s => (
                        <div key={s.id} className="list-item symptom-row-clickable" onClick={() => setDetailSym(s)}>
                          <div className="list-item-icon" style={{ background: SEV_BG[s.severity] || 'var(--err-hl)', color: SEV_COLOR[s.severity] || 'var(--err)' }}>{CAT_ICON[s.category] ?? '🌡️'}</div>
                          <div className="list-item-info">
                            <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''}</div>
                            <div className="list-item-sub">{s.category} · {new Date(s.date + 'T12:00:00').toLocaleDateString('es-ES')}</div>
                          </div>
                          <span className="badge badge-yellow" style={{ flexShrink: 0 }}>Activo</span>
                        </div>
                      ))}
                </div>
                <div className="card">
                  <div className="card-title">Resueltos</div>
                  {resolvedSymptoms.length === 0
                    ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin síntomas resueltos</div>
                    : resolvedSymptoms.map(s => (
                        <div key={s.id} className="list-item symptom-row-clickable" style={{ opacity: .7 }} onClick={() => setDetailSym(s)}>
                          <div className="list-item-icon" style={{ background: 'var(--surface-offset)', color: 'var(--text-faint)' }}>{CAT_ICON[s.category] ?? '🌡️'}</div>
                          <div className="list-item-info">
                            <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''}</div>
                            <div className="list-item-sub">{s.category} · Resuelto</div>
                          </div>
                          <span className="badge badge-gray" style={{ flexShrink: 0 }}>Resuelto</span>
                        </div>
                      ))}
                </div>
              </div>}
        </div>
      )}

      {activeTab === 4 && (
        <div className="card">
          <div className="card-title">
            Notas
            <button className="btn btn-primary btn-sm" onClick={() => setAddNoteOpen(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
              Nueva
            </button>
          </div>
          {localNotes.length === 0
            ? <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin notas aún</div>
            : localNotes.map(n => (
                <div key={n.id} className="list-item" onClick={() => setNoteDetail(n)} style={{ cursor: 'pointer' }}>
                  <div className="list-item-icon" style={{ background: NOTE_BG[n.type] ?? 'var(--primary-hl)', color: NOTE_COLOR[n.type] ?? 'var(--primary)' }}>
                    {NOTE_ICON[n.type] ?? '📋'}
                  </div>
                  <div className="list-item-info">
                    <div className="list-item-title">{NOTE_LABEL[n.type] ?? 'Nota'}{n.vet ? ` — ${n.vet}` : ''}</div>
                    <div className="list-item-sub">{n.content.slice(0, 70)}{n.content.length > 70 ? '…' : ''}</div>
                  </div>
                  <span style={{ fontSize: '.75rem', color: 'var(--text-faint)', flexShrink: 0 }}>
                    {n.date ? new Date(n.date + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : ''}
                  </span>
                </div>
              ))}
        </div>
      )}

      {activeTab === 5 && (
        <div className="card">
          <div className="card-title">Historial completo</div>
          <div className="timeline">
            {[
              { cls: 'vaccine', icon: '💉', title: 'Vacuna antirrábica aplicada', meta: 'Dra. García · VetSalud', time: 'Hoy', medId: undefined, noteId: undefined },
              { cls: 'med',     icon: '💊', title: 'Bravecto', meta: '1 comprimido', time: 'Hace 3d', medId: 'm1', noteId: undefined },
              { cls: 'note',    icon: '📋', title: 'Control anual', meta: 'Peso 4.2 kg', time: '10 ene', medId: undefined, noteId: 'note-1' },
            ].map(e => (
              <div key={e.title} className="timeline-item" onClick={() => setHistDetail(e)} style={{ cursor: 'pointer' }}>
                <div className={`tl-icon ${e.cls}`}>{e.icon}</div>
                <div style={{ flex: 1 }}><div className="tl-title">{e.title}</div><div className="tl-meta">{e.meta}</div></div>
                <div className="tl-time">{e.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ShareModal petName={petData.name} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <EditPetModal isOpen={editOpen} onClose={() => setEditOpen(false)} onSave={setPetData} pet={petData} />
<AddMedicationModal
  isOpen={addMedOpen}
  onClose={() => setAddMedOpen(false)}
  onAdd={(d: AddMedData) => {
    addMedication(d)
    setAddMedOpen(false)
  }}
  defaultPetId={petData.id}
/>
      <NewNoteModal
        isOpen={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        onAdd={d => {
          setLocalNotes(p => [{
            id: `n${Date.now()}`, petId: petData.id,
            content: d.content, vet: d.vet || '', date: d.date, type: d.type, archived: false,
          }, ...p])
          setAddNoteOpen(false)
          showToast('📋 Nota guardada')
        }}
        defaultPetId={petData.id}
      />
      <RegisterSymptomModal
        isOpen={addSymptomOpen}
        onClose={() => setAddSymptomOpen(false)}
        onAdd={(d: SymptomData) => { addSymptom({ ...d, resolved: false }); setAddSymptomOpen(false); showToast('🌡️ Síntoma registrado') }}
        defaultPetId={petData.id}
      />
      <SymptomDetailModal symptom={detailSym} onClose={() => setDetailSym(null)}
        onEdit={s => { setDetailSym(null); setEditSym(s); setEditSymOpen(true) }}
        onResolve={id => { resolve(id); setDetailSym(null); showToast('✓ Síntoma resuelto') }}
        onUnresolve={id => { unresolve(id); setDetailSym(null); showToast('↩ Síntoma reabierto') }} />
      <EditSymptomModal isOpen={editSymOpen} onClose={() => setEditSymOpen(false)} symptom={editSym}
        onSave={updated => { saveSymptom(updated); setEditSymOpen(false); showToast('🌡️ Síntoma actualizado') }} />

      {/* Medicamentos modals */}
      <MedDetailModal
        med={medDetail}
        onClose={() => setMedDetail(null)}
        onEdit={m => { setMedDetail(null); setEditMed(m); setEditMedOpen(true) }}
        onMarkAdministered={(m, _date) => { showToast(`💊 ${m.title} administrado`); setMedDetail(null) }}
      />
<EditMedModal
  isOpen={editMedOpen}
  onClose={() => setEditMedOpen(false)}
  med={editMed}
  onSave={(updated) => {
    updateMedication(updated)
    setEditMedOpen(false)
    showToast('Medicamento actualizado')
  }}
  onDelete={(id) => {
    deleteMedication(id)
    setEditMedOpen(false)
    showToast('Medicamento eliminado')
  }}
/>
    

      {/* Historial detail overlay */}
      {histDetail && (
        <div className="detail-overlay" onClick={() => setHistDetail(null)}>
          <div className="detail-sheet" onClick={e => e.stopPropagation()}>
            <div className="detail-header">
              <div className="detail-icon" style={{
                background: histDetail.cls === 'vaccine' ? 'var(--blue-hl)' : histDetail.cls === 'med' ? 'var(--warn-hl)' : 'var(--primary-hl)',
                color: histDetail.cls === 'vaccine' ? 'var(--blue)' : histDetail.cls === 'med' ? 'var(--warn)' : 'var(--primary)',
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
                  {histDetail.cls === 'vaccine' ? '💉 Vacuna' : histDetail.cls === 'med' ? '💊 Medicamento' : '📋 Nota'}
                </span>
              </div>
              <div className="detail-info-grid">
                <div className="detail-info-chip">
                  <div className="detail-info-label">Evento</div>
                  <div className="detail-info-value">{histDetail.title}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">Detalle</div>
                  <div className="detail-info-value">{histDetail.meta}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">Fecha</div>
                  <div className="detail-info-value">{histDetail.time}</div>
                </div>
                <div className="detail-info-chip">
                  <div className="detail-info-label">Mascota</div>
                  <div className="detail-info-value">{SPECIES_EMOJI[petData.species] ?? '🐾'} {petData.name}</div>
                </div>
              </div>
            </div>
            <div className="detail-footer">
              {histDetail.cls === 'vaccine' && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setActiveTab(1); setHistDetail(null); showToast('💉 Edita desde la pestaña Vacunas') }}>
                  ✏ Ir a Vacunas
                </button>
              )}
              {histDetail.cls === 'med' && histDetail.medId && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  const m = localMeds.find(x => x.id === histDetail.medId)
                  if (m) { setEditMed(m); setEditMedOpen(true); setHistDetail(null) }
                }}>✏ Editar med.</button>
              )}
              {histDetail.cls === 'note' && histDetail.noteId && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => {
                  const n = localNotes.find(x => x.id === histDetail.noteId)
                  if (n) { setEditNote(n); setEditNoteOpen(true); setHistDetail(null) }
                }}>✏ Editar nota</button>
              )}
              <button className="btn btn-secondary" onClick={() => setHistDetail(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Notas modals */}
      <NoteDetailModal
        note={noteDetail}
        onClose={() => setNoteDetail(null)}
        onEdit={n => { setNoteDetail(null); setEditNote(n); setEditNoteOpen(true) }}
        onArchive={id => { setLocalNotes(p => p.map(n => n.id === id ? { ...n, archived: true } : n)); setNoteDetail(null); showToast('📦 Nota archivada') }}
        onUnarchive={id => { setLocalNotes(p => p.map(n => n.id === id ? { ...n, archived: false } : n)); setNoteDetail(null); showToast('📋 Nota restaurada') }}
        onDelete={id => { setLocalNotes(p => p.filter(n => n.id !== id)); setNoteDetail(null); showToast('🗑 Nota eliminada') }}
      />
      <EditNoteModal
        isOpen={editNoteOpen}
        onClose={() => setEditNoteOpen(false)}
        note={editNote}
        onSave={updated => { setLocalNotes(p => p.map(n => n.id === updated.id ? updated : n)); setEditNoteOpen(false); showToast('📋 Nota actualizada') }}
      />

      {/* Chip edit overlay */}
      <PetChipEditOverlay pet={petData} field={chipField} onClose={() => setChipField(null)} onSave={handleChipSave} />
    </div>
  )
}
