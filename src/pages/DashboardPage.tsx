import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePets, PALETTE_COLORS, SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { showToast } from '../components/AppLayout'

// ── Greeting ─────────────────────────────────────────────
function useGreeting() {
  const [text, setText] = useState({ saludo: '¡Bienvenida, Thamires!', date: '' })
  useEffect(() => {
    const now = new Date()
    const h = now.getHours()
    const saludo = h < 12 ? '¡Buenos días' : h < 19 ? '¡Buenas tardes' : '¡Buenas noches'
    const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    setText({
      saludo: `${saludo}, Thamires!`,
      date: `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`,
    })
  }, [])
  return text
}

// ── Paw Layout ────────────────────────────────────────────
const SLOT_CLASSES = [
  'paw-bubble paw-main',
  'paw-bubble paw-toe paw-toe-1',
  'paw-bubble paw-toe paw-toe-2',
  'paw-bubble paw-toe paw-toe-3',
  'paw-bubble paw-toe paw-toe-4',
]

interface PawSlot {
  pet: PetWithAlerts | null
  photo: string | null
  paletteColor: string
}

function buildSlots(pets: PetWithAlerts[]): PawSlot[] {
  const MAX = 5
  const slots: PawSlot[] = []
  for (let i = 0; i < MAX; i++) {
    if (pets.length === 1) {
      const pet = pets[0]
      slots.push({ pet: i === 0 ? pet : null, photo: i === 0 ? (pet.photoUrl || null) : null, paletteColor: PALETTE_COLORS[i % PALETTE_COLORS.length] })
    } else {
      const pet = pets[i] ?? null
      slots.push({ pet, photo: pet?.photoUrl || null, paletteColor: PALETTE_COLORS[i % PALETTE_COLORS.length] })
    }
  }
  return slots
}

interface PawLayoutProps { pets: PetWithAlerts[]; onPetClick: (petId: string) => void }
function PawLayout({ pets, onPetClick }: PawLayoutProps) {
  if (pets.length === 0) {
    return (
      <div className="paw-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="paw-empty"><div className="paw-empty-icon">🐾</div><p>Añade tu primera mascota</p></div>
      </div>
    )
  }
  const slots = buildSlots(pets)
  return (
    <div className="paw-layout">
      {slots.map((slot, i) => {
        const isMain = i === 0
        const slotClass = SLOT_CLASSES[i]
        const highestAlert = slot.pet?.alerts.find(a => a.type === 'err') ?? slot.pet?.alerts[0]

        return (
          <div
            key={i}
            className={slotClass}
            style={!slot.pet ? { cursor: 'default' } : undefined}
            onClick={slot.pet ? () => onPetClick(slot.pet!.id) : undefined}
            title={slot.pet ? `${slot.pet.name}${slot.pet.alerts[0] ? ' — ' + slot.pet.alerts[0].text : ''}` : undefined}
          >
            <div className="paw-bubble-clip" style={{ background: slot.photo ? undefined : slot.paletteColor, fontSize: isMain ? '3rem' : '1.6rem' }}>
              {slot.photo
                ? <img src={slot.photo} alt={slot.pet?.name} loading="lazy" />
                : <span>{slot.pet ? SPECIES_EMOJI[slot.pet.species] ?? '🐾' : ''}</span>
              }
            </div>
            {highestAlert && <div className={`paw-dot ${highestAlert.type}`} />}
            {slot.pet && <div className="paw-pet-name">{slot.pet.name}</div>}
          </div>
        )
      })}
    </div>
  )
}

// ── Care Strip Item ───────────────────────────────────────
interface CareStripItemProps { emoji: string; label: string; done?: boolean; urgent?: boolean; onClick: () => void }
function CareStripItem({ emoji, label, done: initDone = false, urgent = false, onClick }: CareStripItemProps) {
  const [done, setDone] = useState(initDone)
  const cls = ['care-strip-item', done ? 'done' : urgent ? 'urgent' : ''].join(' ')
  return (
    <div className={cls} onClick={() => { setDone(d => !d); onClick() }}>
      {emoji} {label}{done ? ' ✓' : ''}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const { pets, loading } = usePets()
  const { saludo, date } = useGreeting()

  const allAlerts = pets.flatMap(p => p.alerts.map(a => ({ ...a, petName: p.name })))
  const totalAlerts = allAlerts.length

  return (
    <div>
      {/* Greeting */}
      <div className="dash-greeting">
        <div className="greeting-name">{saludo}</div>
        <div className="greeting-date">{date}</div>
      </div>

      {/* Paw wrapper */}
      <div className="paw-wrapper">
        {loading
          ? <div className="paw-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: '.875rem' }}>Cargando…</div>
          : <PawLayout pets={pets} onPetClick={(id) => navigate(`/pets/${id}`)} />
        }

        {/* Caption or alerts */}
        {totalAlerts === 0
          ? <div className="paw-caption">Todo en día ✓</div>
          : (
            <div className="paw-alerts">
              {allAlerts.map((a, i) => (
                <div key={i} className={`paw-alert ${a.type}`}>
                  <span className="paw-alert-icon">{a.type === 'warn' ? '⚠️' : '🔴'}</span>
                  <span className="paw-alert-text"><strong>{a.petName} </strong>{a.text}</span>
                </div>
              ))}
            </div>
          )
        }

        {/* KPI mini-row */}
        <div className="paw-kpis">
          <div className="paw-kpi" style={{ cursor: 'pointer' }} onClick={() => navigate('/pets')}>
            <div className="paw-kpi-value">{pets.length}</div>
            <div className="paw-kpi-label">Mascotas</div>
          </div>
          <div className="paw-kpi" style={{ cursor: 'pointer' }} onClick={() => navigate('/vaccines')}>
            <div className="paw-kpi-value">8</div>
            <div className="paw-kpi-label">Vacunas</div>
            <div className="paw-kpi-sub" style={{ color: 'var(--warn)' }}>⚠ 1 a vencer</div>
          </div>
          <div className="paw-kpi" style={{ cursor: 'pointer' }} onClick={() => navigate('/medications')}>
            <div className="paw-kpi-value">2</div>
            <div className="paw-kpi-label">Medicamentos</div>
            <div className="paw-kpi-sub" style={{ color: 'var(--success)' }}>● Activos</div>
          </div>
          <div className="paw-kpi" style={{ cursor: 'pointer' }} onClick={() => navigate('/symptoms')}>
            <div className="paw-kpi-value">1</div>
            <div className="paw-kpi-label">Síntomas</div>
            <div className="paw-kpi-sub" style={{ color: 'var(--err)' }}>● Toby</div>
          </div>
        </div>
      </div>

      {/* Quick-action grid */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.875rem', marginTop: '1.5rem', width: '100%' }}>
        <div className="dash-section-label">Acciones rápidas</div>
        <div className="quick-grid">
          {[
            { cls: 'qc-vacunas',  emoji: '💉', label: 'Vacunas',       sub: '⚠ 1 a vencer', to: '/vaccines' },
            { cls: 'qc-meds',     emoji: '💊', label: 'Medicamentos',  sub: '2 activos',     to: '/medications' },
            { cls: 'qc-sintomas', emoji: '🌡️', label: 'Síntomas',      sub: '1 en obs.',     to: '/symptoms' },
            { cls: 'qc-notas',    emoji: '📋', label: 'Notas',         sub: 'Ver historial', to: '/notes' },
            { cls: 'qc-agenda',   emoji: '📅', label: 'Agenda',        sub: '+ Consulta',    to: '/cares' },
            { cls: 'qc-mascotas', emoji: '🐾', label: 'Mis Mascotas',  sub: `${pets.length} mascotas`, to: '/pets' },
          ].map(({ cls, emoji, label, sub, to }) => (
            <button key={to} className={`quick-card ${cls}`} onClick={() => navigate(to)}>
              <div className="quick-icon">{emoji}</div>
              <div className="quick-label">{label}</div>
              <div className="quick-sub">{sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Care strip */}
      <div style={{ marginTop: '1.75rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom: 0 }}>Cuidados de hoy</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cares')}>Ver todos →</button>
        </div>
        <div className="dash-care-strip">
          <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '.5rem' }}>
            Lunes, 14 de abril — <span style={{ color: 'var(--err)' }}>3 pendientes</span>
          </div>
          <div className="care-strip-items">
            <CareStripItem emoji="🍽️" label="Luna · comida" urgent onClick={() => navigate('/cares')} />
            <CareStripItem emoji="💧" label="Toby · agua"   done  onClick={() => showToast('Agua de Toby registrada ✓')} />
            <CareStripItem emoji="🏃" label="Toby · paseo" urgent onClick={() => navigate('/cares')} />
            <CareStripItem emoji="💧" label="Kiwi · agua"   done  onClick={() => showToast('Agua de Kiwi registrada ✓')} />
            <CareStripItem emoji="✂️" label="Luna · cepillado"    onClick={() => showToast('Cepillado de Luna registrado ✓')} />
            <CareStripItem emoji="💧" label="Luna · agua"          onClick={() => showToast('Agua de Luna registrada ✓')} />
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <div style={{ marginTop: '2rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="dash-section-label" style={{ marginBottom: 0 }}>Próximos eventos</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vaccines')}>Ver todos →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.625rem' }}>
          {[
            { day: '15', mon: 'ABR', icon: '💉', bg: 'var(--err-hl)', color: 'var(--err)', title: 'Vacuna antirrábica — Luna', sub: 'Vence hoy · Clínica VetSalud', badge: 'URGENTE', badgeCls: 'badge-red', urgent: true, to: '/vaccines' },
            { day: '30', mon: 'ABR', icon: '💊', bg: 'var(--warn-hl)', color: 'var(--warn)', title: 'Pipeta antipulgas — Toby', sub: 'Próxima dosis · 17 días', badge: 'EN 17d', badgeCls: 'badge-yellow', to: '/medications' },
            { day: '05', mon: 'JUN', icon: '💉', bg: 'var(--gold-hl)', color: 'var(--gold)', title: 'Antirrábica — Toby', sub: 'Próxima vacunación · 53 días', badge: '2 MESES', badgeCls: 'badge-yellow', to: '/vaccines' },
          ].map((ev, i) => (
            <div key={i} className={`event-row${ev.urgent ? ' event-urgent' : ''}`} onClick={() => navigate(ev.to)}>
              <div className="event-date-badge"><div className="edb-day">{ev.day}</div><div className="edb-mon">{ev.mon}</div></div>
              <div className="event-icon" style={{ background: ev.bg, color: ev.color }}>{ev.icon}</div>
              <div className="event-info">
                <div className="event-title">{ev.title}</div>
                <div className="event-sub">{ev.sub}</div>
              </div>
              <span className={`badge ${ev.badgeCls}`}>{ev.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
