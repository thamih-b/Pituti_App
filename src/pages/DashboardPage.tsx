import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PALETTE_COLORS, SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { usePituti, useCares } from '../context/PitutiContext'

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
// Formato orgânico: palma grande embaixo + 4 dedos acima
// Dedo do meio (toe-1) mais próximo da palma — pata realista
const SLOT_CLASSES = [
  'paw-bubble paw-main',      // palma
  'paw-bubble paw-toe paw-toe-1', // dedo central-esq (mais baixo e próximo)
  'paw-bubble paw-toe paw-toe-2', // dedo central-dir (mais baixo e próximo)
  'paw-bubble paw-toe paw-toe-3', // dedo externo-esq (mais alto)
  'paw-bubble paw-toe paw-toe-4', // dedo externo-dir (mais alto)
]

interface PawSlot { pet: PetWithAlerts | null; photo: string | null; paletteColor: string }

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
      <div className="paw-layout" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div className="paw-empty"><div className="paw-empty-icon">🐾</div><p>Añade tu primera mascota</p></div>
      </div>
    )
  }
  const slots = buildSlots(pets)
  return (
    <div className="paw-layout">
      {slots.map((slot, i) => {
        const isMain = i === 0
        const highestAlert = slot.pet?.alerts.find(a => a.type === 'err') ?? slot.pet?.alerts[0]
        return (
          <div
            key={i}
            className={SLOT_CLASSES[i]}
            style={!slot.pet ? { cursor:'default' } : undefined}
            onClick={slot.pet ? () => onPetClick(slot.pet!.id) : undefined}
            title={slot.pet ? `${slot.pet.name}${slot.pet.alerts[0] ? ' — ' + slot.pet.alerts[0].text : ''}` : undefined}
          >
            <div className="paw-bubble-clip" style={{ background: slot.photo ? undefined : slot.paletteColor, fontSize: isMain ? '3rem' : '1.4rem' }}>
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
interface CareStripItemProps {
  emoji: string
  label: string
  total?: number       // quantas vezes o cuidado deve ser feito
  doneInit?: number    // quantas já foram feitas ao iniciar
  urgent?: boolean
}
function CareStripItem({ emoji, label, total = 1, doneInit = 0, urgent = false, onDoneChange }: CareStripItemProps & { onDoneChange?: (done: number) => void }) {
  const [doneCount, setDoneCount] = useState(doneInit)
  const allDone = doneCount >= total
  const cls = ['care-strip-item', allDone ? 'done' : urgent && doneCount === 0 ? 'urgent' : ''].join(' ')

  const toggle = (i: number) => {
    setDoneCount(prev => {
      const next = i === prev ? prev + 1 : i === prev - 1 ? prev - 1 : prev
      onDoneChange?.(next)
      return next
    })
  }

  return (
    <div className={cls}>
      <span className="care-emoji">{emoji}</span>
      <span className="care-label">{label}</span>
      <span className="care-dots">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            className={['care-dot-btn', i < doneCount ? 'filled' : ''].join(' ')}
            onClick={() => toggle(i)}
            title={i < doneCount ? 'Desmarcar' : 'Marcar feito'}
          >
            {i < doneCount ? '✓' : '○'}
          </button>
        ))}
      </span>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const { state } = usePituti()
  const { pets, loading } = { pets: state.pets, loading: state.petsLoading }
  const { cares, setCaredone } = useCares()
  const { saludo, date } = useGreeting()
  const allAlerts = pets.flatMap(p => p.alerts.map(a => ({ ...a, petName: p.name })))

  return (
    <div className="dash-mockup-grid">

      {/* ══ COL ESQUERDA — saudação + mascotas ══ */}
      <div className="dash-col-left">
        <div className="dash-greeting">
          <div className="greeting-name">{saludo}</div>
          <div className="greeting-date">{date}</div>
        </div>

        <div className="paw-wrapper">
          {loading
            ? <div className="paw-layout" style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-faint)', fontSize:'.875rem' }}>Cargando…</div>
            : <PawLayout pets={pets} onPetClick={(id) => navigate(`/pets/${id}`)} />
          }
          {allAlerts.length === 0 && (
            <div className="paw-caption">Todo en día ✓</div>
          )}
        </div>
      </div>

      {/* ══ COL CENTRO — Cuidados de hoy ══ */}
      <div className="dash-col-center">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom:0 }}>Cuidados de hoy</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cares')}>Ver todos →</button>
        </div>
        <div style={{ fontSize:'.75rem', color:'var(--text-muted)', fontWeight:700, marginBottom:'.625rem' }}>
          Lunes, 14 de abril — <span style={{ color:'var(--err)' }}>3 pendientes</span>
        </div>
        <div className="dash-care-col">
          {cares.map(c => (
            <CareStripItem
              key={c.id}
              emoji={c.emoji}
              label={c.label}
              total={c.total}
              doneInit={c.done}
              urgent={c.done === 0 && (c.id.includes('food') || c.id.includes('walk'))}
              onDoneChange={(done) => setCaredone(c.id, done)}
            />
          ))}
        </div>
      </div>

      {/* ══ COL CENTRO INFERIOR — Próximos eventos ══ */}
      <div className="dash-col-eventos">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom:0 }}>Próximos eventos</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vaccines')}>Ver todos →</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
          {[
            { day:'15', mon:'ABR', icon:'💉', bg:'var(--err-hl)',  color:'var(--err)',  title:'Vacuna antirrábica — Luna', sub:'Vence hoy · Clínica VetSalud',  badge:'URGENTE', badgeCls:'badge-red',    urgent:true, to:'/vaccines' },
            { day:'30', mon:'ABR', icon:'💊', bg:'var(--warn-hl)', color:'var(--warn)', title:'Pipeta antipulgas — Toby',  sub:'Próxima dosis · 17 días',        badge:'EN 17d',  badgeCls:'badge-yellow',             to:'/medications' },
            { day:'05', mon:'JUN', icon:'💉', bg:'var(--gold-hl)', color:'var(--gold)', title:'Antirrábica — Toby',       sub:'Próxima vacunación · 53 días',   badge:'2 MESES', badgeCls:'badge-yellow',             to:'/vaccines' },
          ].map((ev, i) => (
            <div key={i} className={`event-row${ev.urgent ? ' event-urgent' : ''}`} onClick={() => navigate(ev.to)}>
              <div className="event-date-badge"><div className="edb-day">{ev.day}</div><div className="edb-mon">{ev.mon}</div></div>
              <div className="event-icon" style={{ background:ev.bg, color:ev.color }}>{ev.icon}</div>
              <div className="event-info">
                <div className="event-title">{ev.title}</div>
                <div className="event-sub">{ev.sub}</div>
              </div>
              <span className={`badge ${ev.badgeCls}`}>{ev.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ COL DIREITA — Alertas + KPIs ══ */}
      <div className="dash-col-right">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom:0 }}>Alertas</div>
        </div>
        <div className="dash-kpi-col">
          <div className="paw-kpi" style={{ cursor:'pointer' }} onClick={() => navigate('/pets')}>
            <div className="paw-kpi-value">{pets.length}</div>
            <div className="paw-kpi-label">Mascotas</div>
          </div>
          <div className="paw-kpi" style={{ cursor:'pointer' }} onClick={() => navigate('/vaccines')}>
            <div className="paw-kpi-value">8</div>
            <div className="paw-kpi-label">Vacunas</div>
            <div className="paw-kpi-sub" style={{ color:'var(--warn)' }}>⚠ 1 a vencer</div>
          </div>
          <div className="paw-kpi" style={{ cursor:'pointer' }} onClick={() => navigate('/medications')}>
            <div className="paw-kpi-value">2</div>
            <div className="paw-kpi-label">Medicamentos</div>
            <div className="paw-kpi-sub" style={{ color:'var(--success)' }}>● Activos</div>
          </div>
          <div className="paw-kpi" style={{ cursor:'pointer' }} onClick={() => navigate('/symptoms')}>
            <div className="paw-kpi-value">1</div>
            <div className="paw-kpi-label">Síntomas</div>
            <div className="paw-kpi-sub" style={{ color:'var(--err)' }}>● Toby</div>
          </div>
        </div>
        {allAlerts.length > 0 && (
          <div style={{ marginTop:'1rem', display:'flex', flexDirection:'column', gap:'.5rem' }}>
            {allAlerts.map((a, i) => (
              <div key={i} className={`paw-alert ${a.type}`}>
                <span className="paw-alert-icon">{a.type === 'warn' ? '⚠️' : '🔴'}</span>
                <span className="paw-alert-text"><strong>{a.petName} </strong>{a.text}</span>
              </div>
            ))}
          </div>
        )}
        {allAlerts.length === 0 && (
          <div className="paw-caption" style={{ marginTop:'1rem' }}>Sin alertas activas ✓</div>
        )}
      </div>

    </div>
  )
}
