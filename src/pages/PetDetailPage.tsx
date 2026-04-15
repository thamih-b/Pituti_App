import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_PETS, SPECIES_EMOJI } from '../hooks/usePets'
import { showToast } from '../components/AppLayout'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Input from '../components/Input'

// ── Health ring SVG ───────────────────────────────────────
function HealthRing({ score }: { score: number }) {
  const r = 30, c = 2 * Math.PI * r
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warn)' : 'var(--err)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.25rem', flexShrink: 0 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--surface-offset)" strokeWidth="7"/>
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
          strokeLinecap="round" transform="rotate(-90 36 36)" style={{ transition: 'stroke-dashoffset .6s' }}
        />
        <text x="36" y="40" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="800" fontSize="16" fill="var(--text)">{score}</text>
      </svg>
      <span style={{ fontSize: '.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em' }}>Salud</span>
    </div>
  )
}

// ── Share Modal ───────────────────────────────────────────
function ShareModal({ petName, isOpen, onClose }: { petName: string; isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('caregiver')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`🤝 Compartir cuidados de ${petName}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { onClose(); showToast('¡Invitación enviada!') }}>
            ✉ Enviar invitación
          </Button>
        </>
      }
    >
      <p style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Invita a otro cuidador para registrar cuidados, ver vacunas y medicamentos.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '.8125rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Cuidadores activos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {[
            { initials: 'TL', name: 'Thamires Lopes', role: 'Propietaria · acceso completo', bg: 'var(--pal-lilac)', color: 'var(--nav-bg)', badge: 'Tú', badgeCls: 'badge-green' },
            { initials: 'AM', name: 'Ana Martínez', role: 'Cuidadora · puede registrar', bg: 'var(--blue-hl)', color: 'var(--blue)', badge: null, badgeCls: '' },
          ].map(u => (
            <div key={u.name} className="shared-user">
              <div className="shared-user-avatar" style={{ background: u.bg, color: u.color }}>{u.initials}</div>
              <div style={{ flex: 1 }}>
                <div className="shared-user-name">{u.name}</div>
                <div className="shared-user-role">{u.role}</div>
              </div>
              {u.badge
                ? <span className={`badge ${u.badgeCls}`}>{u.badge}</span>
                : <button className="btn btn-danger btn-sm" onClick={() => showToast('Cuidador eliminado')}>Eliminar</button>
              }
            </div>
          ))}
        </div>
      </div>

      <div className="divider" style={{ margin: '.25rem 0' }} />

      <Input label="Email del cuidador" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@email.com" />
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Nivel de acceso</label>
        <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
          <option value="readonly">Solo lectura (ver registros)</option>
          <option value="caregiver">Cuidador (registrar cuidados)</option>
          <option value="full">Completo (editar perfil también)</option>
        </select>
      </div>
    </Modal>
  )
}

// ── Tab content helpers ───────────────────────────────────
function TabVaccines() {
  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-title">Vacunas <button className="btn btn-primary btn-sm" onClick={() => showToast('Formulario de vacuna')}>+ Añadir</button></div>
        {[
          { name: 'Antirrábica', applied: '15 abr 2024', next: 'Vence en 3 días', cls: 'late', bg: 'var(--err-hl)', color: 'var(--err)', badge: 'URGENTE', badgeCls: 'badge-red' },
          { name: 'Trivalente felina', applied: '10 ene 2026', next: 'Próxima: ene 2027', cls: 'ok', bg: 'var(--success-hl)', color: 'var(--success)', badge: 'AL DÍA', badgeCls: 'badge-green' },
          { name: 'Leucemia felina', applied: '10 ene 2026', next: 'Próxima: ene 2027', cls: 'ok', bg: 'var(--success-hl)', color: 'var(--success)', badge: 'AL DÍA', badgeCls: 'badge-green' },
          { name: 'Calicivirus', applied: '03 mar 2025', next: 'Próxima: jun 2026', cls: 'soon', bg: 'var(--gold-hl)', color: 'var(--gold)', badge: 'EN 2 MESES', badgeCls: 'badge-yellow' },
        ].map(v => (
          <div key={v.name} className="vaccine-row">
            <div className="vaccine-icon" style={{ background: v.bg, color: v.color }}>💉</div>
            <div style={{ flex: 1 }}>
              <div className="vaccine-name">{v.name}</div>
              <div className="vaccine-date">Aplicada: {v.applied}</div>
            </div>
            <div>
              <div className={`vaccine-next ${v.cls}`}>{v.next}</div>
              <span className={`badge ${v.badgeCls}`} style={{ fontSize: '.6rem' }}>{v.badge}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Cobertura</div>
        {[{ label: 'Cobertura vacunal', pct: 75 }, { label: 'Vacunas al día', pct: 75, color: 'success' }, { label: 'Próximas a vencer', pct: 25, color: 'warn' }].map(b => (
          <div key={b.label} style={{ marginBottom: '.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8125rem', marginBottom: '.375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{b.label}</span>
              <span style={{ fontWeight: 700 }}>{b.pct}%</span>
            </div>
            <div className="progress-wrap"><div className={`progress-bar ${b.color ?? ''}`} style={{ width: `${b.pct}%` }} /></div>
          </div>
        ))}
        <div className="divider" />
        <p style={{ fontSize: '.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Luna está en <strong style={{ color: 'var(--warn)' }}>buen estado</strong> pero tiene 1 vacuna urgente y 1 medicamento activo. Se recomienda agendar consulta.
        </p>
      </div>
    </div>
  )
}

function TabCares() {
  const [items, setItems] = useState([
    { id: 'feed',   emoji: '🍽️', title: 'Alimentación',     sub: '2× al día · 80g',          total: 2, done: 1, bg: 'linear-gradient(135deg,#FFF3DC,#FFE0A0)', doneState: false },
    { id: 'water',  emoji: '💧', title: 'Agua fresca',      sub: '1× al día',                 total: 1, done: 1, bg: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)', doneState: true  },
    { id: 'brush',  emoji: '✂️', title: 'Cepillado',        sub: '3× por semana',             total: 3, done: 2, bg: 'linear-gradient(135deg,#F0E8FF,#DDD0FF)', doneState: false },
    { id: 'arena',  emoji: '🧹', title: 'Caja de arena',    sub: 'Higiene simple · diaria',   total: 1, done: 1, bg: 'linear-gradient(135deg,#FFF0E0,#FFD8B0)', doneState: true  },
    { id: 'deep',   emoji: '🛁', title: 'Limpieza profunda',sub: 'Caja de arena · semanal',   total: 7, done: 3, bg: 'linear-gradient(135deg,#E8F8FF,#C0EAFF)', doneState: false },
  ])

  const toggle = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, doneState: !item.doneState, done: !item.doneState ? item.total : Math.max(0, item.done - 1) } : item))
    showToast('Cuidado registrado ✓')
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Cuidados de Luna · hoy</div>
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
              <div><div className="care-title">{item.title}</div><div className="care-sub">{item.sub}</div></div>
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
              <button className="care-btn-cfg" onClick={() => showToast('Configura este cuidado')}>⚙️</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ── PetDetailPage ─────────────────────────────────────────
const TABS = ['🐾 Cuidados', 'Vacunas', 'Medicamentos', 'Síntomas', 'Notas', 'Historial']

export default function PetDetailPage() {
  const { petId } = useParams<{ petId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)

  const pet = MOCK_PETS.find(p => p.id === petId) ?? MOCK_PETS[0]

  return (
    <div>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }} onClick={() => navigate('/pets')}>
        ← Mis mascotas
      </button>

      {/* Hero */}
      <div className="pet-profile-hero">
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div className="pet-profile-avatar">{SPECIES_EMOJI[pet.species] ?? '🐾'}</div>
          <button
            title="Cambiar foto"
            style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)', fontSize: '.75rem', cursor: 'pointer' }}
            onClick={() => showToast('Sube una foto de ' + pet.name)}
          >
            📷
          </button>
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

        <HealthRing score={pet.healthScore} />

        <div style={{ alignSelf: 'flex-start' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => showToast('Editar ' + pet.name)}>✏ Editar</button>
        </div>
      </div>

      {/* Stat chips */}
      <div className="stat-row">
        {[
          { label: 'Especie', value: pet.species === 'cat' ? 'Gato 🐱' : pet.species === 'dog' ? 'Perro 🐶' : 'Ave 🦜' },
          { label: 'Nacimiento', value: pet.birthDate ? new Date(pet.birthDate).toLocaleDateString('es-ES') : '—' },
          { label: 'Peso', value: pet.species === 'cat' ? '4.2 kg' : pet.species === 'dog' ? '12.4 kg' : '32 g' },
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
        <button className="btn btn-secondary btn-sm" onClick={() => setShareOpen(true)}>
          👥 Compartir
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map((t, i) => (
          <div key={t} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && <TabCares />}
      {activeTab === 1 && <TabVaccines />}
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
              { cls: 'med',     icon: '💊', title: 'Antiparasitario — Bravecto',  meta: '1 comprimido · dosis aplicada',       time: 'Hace 3d'  },
              { cls: 'note',    icon: '📋', title: 'Nota de control anual',        meta: 'Peso 4.2 kg · todo normal',           time: '10 ene'   },
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
