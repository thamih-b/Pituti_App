import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_PETS, SPECIES_EMOJI, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Input from '../components/Input'
import VaccRing from '../components/VaccRing'

// ─────────────────────────────────────────────────────────
// RegisterVaccineModal  (exportado para VaccinesPage)
// ─────────────────────────────────────────────────────────
export function RegisterVaccineModal({
  petName, isOpen, onClose, vaccines, onRegister,
}: {
  petName:    string
  isOpen:     boolean
  onClose:    () => void
  vaccines:   VaccineRecord[]
  onRegister: (v: { name: string; date: string; nextDate: string; vet: string; notes: string }) => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.selected)  e.selected = 'Selecciona una vacuna'
    if (!form.date)      e.date     = 'La fecha de aplicación es obligatoria'
    if (!form.nextDate)  e.next     = 'La próxima fecha es obligatoria'
    else if (new Date(form.nextDate) <= new Date(form.date))
      e.next = 'Debe ser posterior a la fecha de aplicación'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onRegister({ name: form.selected, date: form.date, nextDate: form.nextDate, vet: form.vet, notes: form.notes })
    showToast(`Aplicación de "${form.selected}" registrada ✓`)
    setForm({ selected: '', date: today, nextDate: '', vet: '', notes: '' })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`💉 Registrar vacuna — ${petName}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Registrar aplicación</Button>
        </>
      }
    >
      {/* Selección de vacuna */}
      <div className="form-group">
        <label className="form-label">Vacuna *</label>
        <select
          className={['form-input', errors.selected ? 'form-input--err' : ''].join(' ')}
          value={form.selected}
          onChange={e => set('selected', e.target.value)}
        >
          <option value="">Seleccionar vacuna…</option>
          {vaccines.map(v => (
            <option key={v.name} value={v.name}>{v.name}</option>
          ))}
        </select>
        {errors.selected && <span className="form-hint-err">{errors.selected}</span>}
      </div>

      {/* Fechas */}
      <div className="form-row">
        <Input
          label="Fecha de aplicación *"
          name="date"
          type="date"
          value={form.date}
          onChange={e => set('date', e.target.value)}
        />
        <Input
          label="Próxima aplicación *"
          name="nextDate"
          type="date"
          value={form.nextDate}
          onChange={e => set('nextDate', e.target.value)}
        />
      </div>
      {errors.next && <span className="form-hint-err" style={{ marginTop: '-.5rem', display: 'block', marginBottom: '.75rem' }}>{errors.next}</span>}

      {/* Veterinario */}
      <Input
        label="Veterinario (opcional)"
        name="vet"
        placeholder="Ej: Dra. García · Clínica VetSalud"
        value={form.vet}
        onChange={e => set('vet', e.target.value)}
      />

      {/* Notas */}
      <div className="form-group">
        <label className="form-label">Notas (opcional)</label>
        <textarea
          className="form-input"
          rows={3}
          placeholder="Reacciones, lote, observaciones…"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          style={{ resize: 'vertical', minHeight: 72, fontFamily: 'inherit' }}
        />
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────
// ShareModal
// ─────────────────────────────────────────────────────────
function ShareModal({ petName, isOpen, onClose }: { petName: string; isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [role,  setRole]  = useState('caregiver')
  const [emailErr, setEmailErr] = useState('')
  const [caregivers, setCaregivers] = useState([
    { id: 'tl', initials: 'TL', name: 'Thamires Lopes', role: 'Propietaria · acceso completo', bg: 'var(--pal-lilac)',  color: 'var(--nav-bg)', badge: 'Tú',  removable: false },
    { id: 'am', initials: 'AM', name: 'Ana Martínez',   role: 'Cuidadora · puede registrar',  bg: 'var(--blue-hl)',   color: 'var(--blue)',   badge: null,  removable: true  },
  ])

  const handleInvite = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailErr('Introduce un email válido')
      return
    }
    const initials = email.split('@')[0].slice(0, 2).toUpperCase()
    const roleLabel = role === 'readonly' ? 'Solo lectura' : role === 'caregiver' ? 'Cuidador · puede registrar' : 'Acceso completo'
    setCaregivers(prev => [...prev, { id: Date.now().toString(), initials, name: email, role: roleLabel, bg: 'var(--gold-hl)', color: 'var(--gold)', badge: null, removable: true }])
    setEmail('')
    setEmailErr('')
    showToast('¡Invitación enviada!')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`👥 Compartir cuidados — ${petName}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          <Button onClick={handleInvite}>Enviar invitación</Button>
        </>
      }
    >
      {/* Cuidadores activos */}
      <p className="form-label" style={{ marginBottom: '.5rem' }}>Cuidadores activos</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1.125rem' }}>
        {caregivers.map(u => (
          <div key={u.id} className="shared-user">
            <div className="shared-user-avatar" style={{ background: u.bg, color: u.color }}>{u.initials}</div>
            <div style={{ flex: 1 }}>
              <div className="shared-user-name">{u.name}</div>
              <div className="shared-user-role">{u.role}</div>
            </div>
            {u.badge
              ? <span className="badge badge-green">{u.badge}</span>
              : <button className="btn btn-danger btn-sm" onClick={() => { setCaregivers(p => p.filter(c => c.id !== u.id)); showToast('Cuidador eliminado') }}>Eliminar</button>
            }
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* Invitar */}
      <p className="form-label" style={{ margin: '.875rem 0 .5rem' }}>Invitar nuevo cuidador</p>
      <Input
        label="Email *"
        name="email"
        type="email"
        placeholder="nombre@email.com"
        value={email}
        onChange={e => { setEmail(e.target.value); setEmailErr('') }}
      />
      {emailErr && <span className="form-hint-err">{emailErr}</span>}

      <div className="form-group">
        <label className="form-label">Nivel de acceso</label>
        <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
          <option value="readonly">👁 Solo lectura — ver registros</option>
          <option value="caregiver">✏️ Cuidador — registrar cuidados</option>
          <option value="full">⚙️ Completo — editar perfil también</option>
        </select>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────
// CareSettingsModal
// ─────────────────────────────────────────────────────────
function CareSettingsModal({ care, isOpen, onClose, onSave }: {
  care:    { id: string; emoji: string; title: string; sub: string; total: number }
  isOpen:  boolean
  onClose: () => void
  onSave:  (d: { title: string; total: number; period: string; quantity: string; notify: boolean }) => void
}) {
  const [title,    setTitle]    = useState(care.title)
  const [total,    setTotal]    = useState(String(care.total))
  const [period,   setPeriod]   = useState('day')
  const [quantity, setQuantity] = useState('')
  const [notify,   setNotify]   = useState(true)

  const handleSave = () => {
    onSave({ title, total: Number(total) || 1, period, quantity, notify })
    showToast('Cuidado actualizado ✓')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${care.emoji} Configurar cuidado`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </>
      }
    >
      <Input
        label="Nombre del cuidado"
        name="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Ej: Alimentación"
      />
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Frecuencia</label>
          <input className="form-input" type="number" min="1" max="10" value={total} onChange={e => setTotal(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Período</label>
          <select className="form-input" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="day">Por día</option>
            <option value="week">Por semana</option>
            <option value="month">Por mes</option>
          </select>
        </div>
      </div>
      <Input
        label="Cantidad / dosis (opcional)"
        name="quantity"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        placeholder="Ej: 80g · 2 cucharadas"
      />
      {/* Toggle notificaciones */}
      <div className="list-item" style={{ cursor: 'default', background: 'var(--surface-offset)', borderRadius: 'var(--r-lg)', padding: '.75rem 1rem', marginTop: '.25rem' }}>
        <div className="list-item-info">
          <div className="list-item-title">Notificaciones</div>
          <div className="list-item-sub">Recordatorio cuando sea la hora</div>
        </div>
        <button
          onClick={() => setNotify(n => !n)}
          style={{ width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', background: notify ? 'var(--primary)' : 'var(--border)', transition: 'background .2s', position: 'relative', flexShrink: 0 }}
        >
          <span style={{ position: 'absolute', top: 2, left: notify ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .2s', display: 'block' }} />
        </button>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────────────────
// TabCares
// ─────────────────────────────────────────────────────────
function TabCares() {
  const [items, setItems] = useState([
    { id: 'feed',  emoji: '🍽️', title: 'Alimentación',     sub: '2× al día · 80g',         total: 2, done: 1, bg: 'linear-gradient(135deg,#FFF3DC,#FFE0A0)', doneState: false },
    { id: 'water', emoji: '💧', title: 'Agua fresca',       sub: '1× al día',                total: 1, done: 1, bg: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)', doneState: true  },
    { id: 'brush', emoji: '✂️', title: 'Cepillado',         sub: '3× por semana',            total: 3, done: 2, bg: 'linear-gradient(135deg,#F0E8FF,#DDD0FF)', doneState: false },
    { id: 'arena', emoji: '🧹', title: 'Caja de arena',     sub: 'Higiene simple · diaria',  total: 1, done: 1, bg: 'linear-gradient(135deg,#FFF0E0,#FFD8B0)', doneState: true  },
    { id: 'deep',  emoji: '🛁', title: 'Limpieza profunda', sub: 'Caja de arena · semanal',  total: 7, done: 3, bg: 'linear-gradient(135deg,#E8F8FF,#C0EAFF)', doneState: false },
  ])
  const [settingsItem, setSettingsItem] = useState<typeof items[0] | null>(null)

  const toggle = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, doneState: !item.doneState, done: !item.doneState ? item.total : Math.max(0, item.done - 1) }
        : item
    ))
    showToast('Cuidado registrado ✓')
  }

  const handleSaveSettings = (data: { title: string; total: number; period: string; quantity: string; notify: boolean }) => {
    if (!settingsItem) return
    setItems(prev => prev.map(item =>
      item.id === settingsItem.id
        ? { ...item, title: data.title, total: data.total, sub: `${data.total}× por ${data.period === 'day' ? 'día' : data.period === 'week' ? 'semana' : 'mes'}${data.quantity ? ' · ' + data.quantity : ''}` }
        : item
    ))
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Cuidados de hoy</div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {items.filter(i => i.doneState).length} de {items.length} completados
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => showToast('Formulario de cuidado')}>+ Añadir cuidado</button>
      </div>
      <div className="care-grid">
        {items.map(item => (
          <div key={item.id} className={['care-card', item.doneState ? 'done' : ''].join(' ')}>
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
                  <div key={j} className={`care-dot ${j < item.done ? 'done' : ''}`} />
                ))}
              </div>
              <span>{item.doneState ? <span style={{ color: 'var(--success)' }}>Hecho ✓</span> : `${item.done}/${item.total}`}</span>
            </div>
            <div className="care-actions">
              <button className={`care-btn-do ${item.doneState ? 'done-btn' : ''}`} onClick={() => toggle(item.id)}>
                ✓ {item.doneState ? 'Hecho' : 'Registrar'}
              </button>
              <button className="care-btn-cfg" onClick={() => setSettingsItem(item)}>⚙️</button>
            </div>
          </div>
        ))}
      </div>
      {settingsItem && (
        <CareSettingsModal
          care={settingsItem}
          isOpen={!!settingsItem}
          onClose={() => setSettingsItem(null)}
          onSave={handleSaveSettings}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────
// TabVaccines
// ─────────────────────────────────────────────────────────
function TabVaccines({ petId, petName }: { petId: string; petName: string }) {
  const [registerOpen, setRegisterOpen] = useState(false)
  const [extraVacc,    setExtraVacc]    = useState<VaccineRecord[]>([])

  const baseVaccines = VACCINES_BY_PET[petId] ?? []
  const vaccines     = [...baseVaccines, ...extraVacc]
  const withStatus   = vaccines.map(v => ({ ...v, cls: getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late' }))

  const okCount      = withStatus.filter(v => v.cls === 'ok').length
  const alDiaCount   = withStatus.filter(v => v.cls === 'ok' || v.cls === 'soon').length
  const pendingCount = withStatus.filter(v => v.cls === 'soon' || v.cls === 'late').length
  const total        = vaccines.length

  const coverage   = total > 0 ? Math.round((okCount      / total) * 100) : 100
  const alDiaPct   = total > 0 ? Math.round((alDiaCount   / total) * 100) : 100
  const pendingPct = total > 0 ? Math.round((pendingCount / total) * 100) : 0

  const handleRegister = ({ name, date, nextDate }: { name: string; date: string; nextDate: string; vet: string; notes: string }) => {
    const lbl = new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    const cls = getVaccStatus(nextDate)
    setExtraVacc(prev => [...prev, {
      name, applied: lbl, nextDate,
      badge:    cls === 'ok' ? 'AL DÍA' : cls === 'soon' ? 'POR VENCER' : 'VENCIDA',
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
          {withStatus.map(v => (
            <div key={v.name + v.nextDate} className="vaccine-row">
              <div className="vaccine-icon" style={{
                background: v.cls === 'ok' ? 'var(--success-hl)' : v.cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
                color:      v.cls === 'ok' ? 'var(--success)'    : v.cls === 'soon' ? 'var(--gold)'    : 'var(--err)',
              }}>💉</div>
              <div style={{ flex: 1 }}>
                <div className="vaccine-name">{v.name}</div>
                <div className="vaccine-date">Aplicada {v.applied}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`vaccine-next ${v.cls}`}>
                  {v.cls === 'late'
                    ? `Vencida · ${new Date(v.nextDate).toLocaleDateString('es-ES')}`
                    : `Próxima ${new Date(v.nextDate).toLocaleDateString('es-ES')}`}
                </div>
                <span className={`badge ${v.badgeCls}`} style={{ fontSize: '.6rem' }}>{v.badge}</span>
              </div>
            </div>
          ))}
          {vaccines.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>Sin vacunas registradas</div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Cobertura</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
            <VaccRing coverage={coverage} size={96} strokeWidth={8} />
          </div>
          {[
            { label: 'Cobertura vacunal',   pct: coverage,   color: ''        },
            { label: 'Vacunas al día',      pct: alDiaPct,   color: 'success' },
            { label: 'Pendientes/vencidas', pct: pendingPct, color: pendingPct > 0 ? 'warn' : 'success' },
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
        petName={petName}
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        vaccines={vaccines}
        onRegister={handleRegister}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────
// PetDetailPage
// ─────────────────────────────────────────────────────────
const TABS = ['🐾 Cuidados', 'Vacunas', 'Medicamentos', 'Síntomas', 'Notas', 'Historial']

export default function PetDetailPage() {
  const { petId }  = useParams<{ petId: string }>()
  const navigate   = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)

  const pet = MOCK_PETS.find(p => p.id === petId) ?? MOCK_PETS[0]

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }} onClick={() => navigate('/pets')}>← Mis mascotas</button>

      {/* Hero */}
      <div className="pet-profile-hero">
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div className="pet-profile-avatar">{SPECIES_EMOJI[pet.species] ?? '🐾'}</div>
          <button
            title="Cambiar foto"
            style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)', fontSize: '.75rem', cursor: 'pointer' }}
            onClick={() => showToast('Sube una foto de ' + pet.name)}
          >📷</button>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400 }}>{pet.name}</h1>
            <span style={{ fontSize: '1.1rem' }}>{SPECIES_EMOJI[pet.species]}</span>
            <span className="badge badge-green" style={{ marginLeft: '.25rem' }}>Saludable</span>
          </div>
          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
            {pet.breed ?? 'Raza desconocida'} · {pet.species === 'cat' ? 'Hembra' : 'Macho'} · 4 años
          </p>
          <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
            {pet.alerts.map((a, i) => (
              <span key={i} className={`badge ${a.type === 'err' ? 'badge-red' : 'badge-yellow'}`}>
                {a.type === 'warn' ? '⚠️' : '🔴'} {a.text.slice(0, 28)}…
              </span>
            ))}
            <span className="badge badge-blue">💊 Med. activo</span>
            <span className="badge badge-green">🍽 Alimentada hoy</span>
          </div>
        </div>
        <div style={{ alignSelf: 'flex-start' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => showToast('Editar ' + pet.name)}>✏ Editar</button>
        </div>
      </div>

      {/* Stat chips */}
      <div className="stat-row">
        {[
          { label: 'Especie',    value: pet.species === 'cat' ? 'Gato 🐱' : pet.species === 'dog' ? 'Perro 🐶' : 'Ave 🦜' },
          { label: 'Nacimiento', value: pet.birthDate ? new Date(pet.birthDate).toLocaleDateString('es-ES') : '—' },
          { label: 'Peso',       value: pet.species === 'cat' ? '4.2 kg' : pet.species === 'dog' ? '12.4 kg' : '32 g' },
          { label: 'Cuidadores', value: null },
        ].map(s => (
          <div key={s.label} className="stat-chip">
            <div className="stat-chip-label">{s.label}</div>
            {s.value
              ? <div className="stat-chip-value" style={{ fontSize: '1rem' }}>{s.value}</div>
              : <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem' }}>TL</div>
                  {pet.id === 'pet-1' && <div className="caregiver-avatar" style={{ width: 28, height: 28, fontSize: '.625rem', background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
                </div>
            }
          </div>
        ))}
      </div>

      {/* Share strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '1.125rem', padding: '.75rem 1rem', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-sm)' }}>
        <span style={{ fontSize: '.8125rem', fontWeight: 700, color: 'var(--text-muted)', flex: 1 }}>Cuidadores compartidos</span>
        <div className="caregiver-avatars">
          <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem' }}>TL</div>
          {pet.id === 'pet-1' && <div className="caregiver-avatar" style={{ width: 30, height: 30, fontSize: '.625rem', background: 'var(--blue-hl)', color: 'var(--blue)' }}>AM</div>}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShareOpen(true)}>👥 Compartir</button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map((t, i) => (
          <div key={t} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>
        ))}
      </div>

      {activeTab === 0 && <TabCares />}
      {activeTab === 1 && <TabVaccines petId={pet.id} petName={pet.name} />}
      {activeTab === 2 && (
        <div className="card">
          <div className="card-title">Medicamentos activos <button className="btn btn-primary btn-sm" onClick={() => showToast('Formulario de medicamento')}>+ Añadir</button></div>
          <div className="list-item">
            <div className="list-item-icon" style={{ background: 'var(--warn-hl)', color: 'var(--warn)' }}>💊</div>
            <div className="list-item-info"><div className="list-item-title">Antiparasitario — Bravecto</div><div className="list-item-sub">1 comprimido cada 3 meses · Próxima: 10 jul 2026</div></div>
            <div className="list-item-right"><span className="badge badge-green">Activo</span></div>
          </div>
        </div>
      )}
      {activeTab === 3 && (
        <div className="empty">
          <div style={{ fontSize: '3rem' }}>🌡️</div>
          <h3>Sin síntomas registrados</h3>
          <p>{pet.name} está bien. Registra cualquier cambio de comportamiento aquí.</p>
          <button className="btn btn-primary" onClick={() => showToast('Formulario de síntoma')}>+ Registrar síntoma</button>
        </div>
      )}
      {activeTab === 4 && (
        <div className="card">
          <div className="card-title">Notas veterinarias <button className="btn btn-primary btn-sm" onClick={() => showToast('Nueva nota')}>+ Nueva nota</button></div>
          <div className="list-item">
            <div className="list-item-icon" style={{ background: 'var(--primary-hl)', color: 'var(--primary)' }}>📋</div>
            <div className="list-item-info"><div className="list-item-title">Control anual — Dra. Martínez</div><div className="list-item-sub">{pet.name} en buen estado. Peso estable. Revisar vacuna antirrábica.</div></div>
            <span style={{ fontSize: '.75rem', color: 'var(--text-faint)' }}>10 ene 2026</span>
          </div>
        </div>
      )}
      {activeTab === 5 && (
        <div className="card">
          <div className="card-title">Historial completo</div>
          <div className="timeline">
            {[
              { cls: 'vaccine', icon: '💉', title: 'Vacuna antirrábica aplicada', meta: 'Dra. García · Clínica VetSalud', time: 'Hoy 10:22' },
              { cls: 'med',     icon: '💊', title: 'Antiparasitario — Bravecto',  meta: '1 comprimido · dosis aplicada',  time: 'Hace 3d'  },
              { cls: 'note',    icon: '📋', title: 'Nota de control anual',        meta: 'Peso 4.2 kg · todo normal',      time: '10 ene'   },
            ].map(e => (
              <div key={e.title} className="timeline-item">
                <div className={`tl-icon ${e.cls}`}>{e.icon}</div>
                <div style={{ flex: 1 }}><div className="tl-title">{e.title}</div><div className="tl-meta">{e.meta}</div></div>
                <div className="tl-time">{e.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ShareModal petName={pet.name} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  )
}
