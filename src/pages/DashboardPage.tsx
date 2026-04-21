import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PALETTE_COLORS, SPECIES_EMOJI } from '../hooks/usePets'
import type { PetWithAlerts } from '../hooks/usePets'
import { usePituti, useCares } from '../context/PitutiContext'
import CareDetailModal from '../components/CareDetailModal'
import type { CareDetailItem } from '../components/CareDetailModal'
import EditCareModal from '../components/EditCareModal'
import type { CareEditData } from '../components/EditCareModal'

// ── Greeting ─────────────────────────────────────────────
function useGreeting() {
  const [text, setText] = useState({ saludo: '¡Bienvenida, Thamires!', date: '' })
  useEffect(() => {
    const now = new Date()
    const h = now.getHours()
    const saludo = h < 12 ? '¡Buenos días' : h < 19 ? '¡Buenas tardes' : '¡Buenas noches'
    const days   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
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

interface PawSlot { pet: PetWithAlerts | null; photo: string | null; paletteColor: string }

function buildSlots(pets: PetWithAlerts[]): PawSlot[] {
  return Array.from({ length: 5 }, (_, i) => {
    const pet = pets.length === 1 && i > 0 ? null : (pets[i] ?? null)
    const p   = pets.length === 1 ? pets[0] : pet
    return { pet: pets.length === 1 ? (i === 0 ? pets[0] : null) : pet, photo: p?.photoUrl || null, paletteColor: PALETTE_COLORS[i % PALETTE_COLORS.length] }
  })
}

interface PawLayoutProps { pets: PetWithAlerts[]; onPetClick: (petId: string) => void }
function PawLayout({ pets, onPetClick }: PawLayoutProps) {
  if (pets.length === 0) return (
    <div className="paw-layout" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="paw-empty"><div className="paw-empty-icon">🐾</div><p>Añade tu primera mascota</p></div>
    </div>
  )
  const slots  = buildSlots(pets)
  const photos: Record<string, string> = {}
  try { Object.keys(localStorage).filter(k => k.startsWith('pet-photo-')).forEach(k => { photos[k.replace('pet-photo-','')] = localStorage.getItem(k)! }) } catch {}
  return (
    <div className="paw-layout">
      {slots.map((slot, i) => {
        const photo = slot.pet ? (photos[slot.pet.id] || null) : null
        const highestAlert = slot.pet?.alerts.find(a => a.type === 'err') ?? slot.pet?.alerts[0]
        return (
          <div key={i} className={SLOT_CLASSES[i]}
            style={!slot.pet ? { cursor:'default' } : undefined}
            onClick={slot.pet ? () => onPetClick(slot.pet!.id) : undefined}
            title={slot.pet ? slot.pet.name : undefined}>
            <div className="paw-bubble-clip" style={{ background: photo ? undefined : slot.paletteColor, fontSize: i === 0 ? '3rem' : '1.4rem' }}>
              {photo ? <img src={photo} alt={slot.pet?.name} loading="lazy" />
                : <span>{slot.pet ? SPECIES_EMOJI[slot.pet.species] ?? '🐾' : ''}</span>}
            </div>
            {highestAlert && <div className={`paw-dot ${highestAlert.type}`} />}
            {slot.pet && <div className="paw-pet-name">{slot.pet.name}</div>}
          </div>
        )
      })}
    </div>
  )
}

// ── Care Strip Item — CLICKABLE ───────────────────────────
interface CareStripItemProps {
  emoji: string; label: string; total?: number; doneInit?: number; urgent?: boolean
  onDoneChange?: (done: number) => void
  onClick?: () => void
}
function CareStripItem({ emoji, label, total = 1, doneInit = 0, urgent = false, onDoneChange, onClick }: CareStripItemProps) {
  const [doneCount, setDoneCount] = useState(doneInit)
  const allDone = doneCount >= total
  const cls = ['care-strip-item', allDone ? 'done' : urgent && doneCount === 0 ? 'urgent' : ''].join(' ')
  const toggle = (i: number) => {
    setDoneCount(prev => {
      const next = i === prev ? prev + 1 : i === prev - 1 ? prev - 1 : prev
      onDoneChange?.(next); return next
    })
  }
  return (
    <div className={cls} onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <span className="care-emoji">{emoji}</span>
      <span className="care-label">{label}</span>
      <span className="care-dots" onClick={e => e.stopPropagation()}>
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} className={['care-dot-btn', i < doneCount ? 'filled' : ''].join(' ')}
            onClick={() => toggle(i)} title={i < doneCount ? 'Desmarcar' : 'Marcar feito'}>
            {i < doneCount ? '✓' : '○'}
          </button>
        ))}
      </span>
    </div>
  )
}

// ── Care items state (extended with bg info) ──────────────
interface DashCareItem {
  id: string; petId: string; emoji: string; label: string; total: number; done: number
  title: string; sub: string; bg: string; done_state: boolean
}

const INITIAL_DASH_CARES: DashCareItem[] = [
  { id:'pet-1_food',  petId:'pet-1', emoji:'🍽️', label:'Luna · comida',    title:'Alimentación', sub:'2× día · 80g',  total:2, done:0, bg:'linear-gradient(135deg,#FFF3DC,#FFE0A0)', done_state:false },
  { id:'pet-2_water', petId:'pet-2', emoji:'💧', label:'Toby · agua',      title:'Agua',         sub:'3× día',         total:3, done:2, bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state:false },
  { id:'pet-2_walk',  petId:'pet-2', emoji:'🏃', label:'Toby · paseo',     title:'Paseo',        sub:'2× día',         total:2, done:0, bg:'linear-gradient(135deg,#E8FFE8,#B8F0B8)', done_state:false },
  { id:'pet-3_water', petId:'pet-3', emoji:'💧', label:'Kiwi · agua',      title:'Agua',         sub:'2× día',         total:2, done:2, bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state:true  },
  { id:'pet-1_brush', petId:'pet-1', emoji:'✂️', label:'Luna · cepillado', title:'Cepillado',    sub:'1× semana',      total:1, done:0, bg:'linear-gradient(135deg,#F0E8FF,#DDD0FF)', done_state:false },
  { id:'pet-1_water', petId:'pet-1', emoji:'💧', label:'Luna · agua',      title:'Agua',         sub:'2× día',         total:2, done:1, bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', done_state:false },
]

// ── Dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const { state } = usePituti()
  const { pets, loading } = { pets: state.pets, loading: state.petsLoading }
  const { setCaredone } = useCares()
  const { saludo, date } = useGreeting()
  const allAlerts = pets.flatMap(p => p.alerts.map(a => ({ ...a, petName: p.name })))

  const [dashCares,     setDashCares]     = useState<DashCareItem[]>(INITIAL_DASH_CARES)
  const [detailItem,    setDetailItem]    = useState<CareDetailItem | null>(null)
  const [editCareItem,  setEditCareItem]  = useState<CareEditData | null>(null)
  const [editCareOpen,  setEditCareOpen]  = useState(false)

  const handleCareToggle = useCallback((id: string, newDone: number, newState: boolean) => {
    setDashCares(prev => prev.map(c => c.id !== id ? c : { ...c, done: newDone, done_state: newState }))
    setCaredone(id, newDone)
  }, [setCaredone])

  const openDetail = (c: DashCareItem) => {
    setDetailItem({ id:c.id, petId:c.petId, emoji:c.emoji, title:c.title, sub:c.sub, total:c.total, done:c.done, done_state:c.done_state, bg:c.bg })
  }

  const handleEditFromDetail = (item: CareDetailItem) => {
    setEditCareItem({ id:item.id, emoji:item.emoji, title:item.title, total:item.total, period:'day', quantity:'', notify:true, bg:item.bg })
    setEditCareOpen(true)
  }

  const handleSaveCare = (updated: CareEditData) => {
    setDashCares(prev => prev.map(c => c.id !== updated.id ? c : {
      ...c, emoji:updated.emoji, title:updated.title, total:updated.total,
      label: c.label.split('·')[0].trim() + ' · ' + updated.title.toLowerCase(),
      sub:`${updated.total}× ${updated.period === 'day' ? 'día' : updated.period === 'week' ? 'semana' : 'mes'}${updated.quantity?' · '+updated.quantity:''}`,
    }))
  }

  // Navigate to vaccines calendar with initial date
  const openCalendarAt = (dateStr: string) => {
    navigate('/vaccines', { state: { initialDate: dateStr } })
  }

  return (
    <div className="dash-mockup-grid">

      {/* ══ COL ESQUERDA ══ */}
      <div className="dash-col-left">
        <div className="dash-greeting">
          <div className="greeting-name">{saludo}</div>
          <div className="greeting-date">{date}</div>
        </div>
        <div className="paw-wrapper">
          {loading
            ? <div className="paw-layout" style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-faint)', fontSize:'.875rem' }}>Cargando…</div>
            : <PawLayout pets={pets} onPetClick={id => navigate(`/pets/${id}`)} />
          }
          {allAlerts.length === 0 && <div className="paw-caption">Todo en día ✓</div>}
        </div>
      </div>

      {/* ══ COL CENTRO — Cuidados ══ */}
      <div className="dash-col-center">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
          <div className="dash-section-label" style={{ marginBottom:0 }}>Cuidados de hoy</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cares')}>Ver todos →</button>
        </div>
        <div style={{ fontSize:'.75rem', color:'var(--text-muted)', fontWeight:700, marginBottom:'.625rem' }}>
          Hoy — <span style={{ color:'var(--err)' }}>
            {dashCares.filter(c => !c.done_state).length} pendientes
          </span>
        </div>
        <div className="dash-care-col">
          {dashCares.map(c => (
            <CareStripItem
              key={c.id}
              emoji={c.emoji}
              label={c.label}
              total={c.total}
              doneInit={c.done}
              urgent={c.done === 0 && (c.id.includes('food') || c.id.includes('walk'))}
              onDoneChange={done => handleCareToggle(c.id, done, done >= c.total)}
              onClick={() => openDetail(c)}
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
            { day:'23', mon:'ABR', icon:'💉', bg:'var(--err-hl)',  color:'var(--err)',  title:'Vacuna antirrábica — Luna', sub:'Vence pronto · Clínica VetSalud', badge:'URGENTE', badgeCls:'badge-red',    urgent:true, date:'2026-04-23' },
            { day:'30', mon:'ABR', icon:'💊', bg:'var(--warn-hl)', color:'var(--warn)', title:'Pipeta antipulgas — Toby',  sub:'Próxima dosis · 17 días',         badge:'EN 17d',  badgeCls:'badge-yellow',             date:'2026-04-30' },
            { day:'05', mon:'JUN', icon:'💉', bg:'var(--gold-hl)', color:'var(--gold)', title:'Antirrábica — Toby',       sub:'Próxima vacunación · 53 días',    badge:'2 MESES', badgeCls:'badge-yellow',             date:'2026-06-05' },
          ].map((ev, i) => (
            <div key={i} className={`event-row${ev.urgent ? ' event-urgent' : ''}`}
              onClick={() => openCalendarAt(ev.date)}
              title="Ver en calendario">
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
          {[
            { val:pets.length, label:'Mascotas',     sub:null,                         color:'',              to:'/pets'        },
            { val:8,           label:'Vacunas',      sub:'⚠ 1 a vencer',              color:'var(--warn)',   to:'/vaccines'    },
            { val:2,           label:'Medicamentos', sub:'● Activos',                  color:'var(--success)',to:'/medications' },
            { val:1,           label:'Síntomas',     sub:'● Toby',                     color:'var(--err)',    to:'/symptoms'    },
          ].map(k => (
            <div key={k.label} className="paw-kpi" style={{ cursor:'pointer' }} onClick={() => navigate(k.to)}>
              <div className="paw-kpi-value">{k.val}</div>
              <div className="paw-kpi-label">{k.label}</div>
              {k.sub && <div className="paw-kpi-sub" style={{ color: k.color }}>{k.sub}</div>}
            </div>
          ))}
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
        {allAlerts.length === 0 && <div className="paw-caption" style={{ marginTop:'1rem' }}>Sin alertas activas ✓</div>}
      </div>

      {/* ── Care Detail Overlay ── */}
      {detailItem && (
        <CareDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onToggle={(id, newDone, newState) => {
            handleCareToggle(id, newDone, newState)
            setDetailItem(prev => prev ? { ...prev, done: newDone, done_state: newState } : null)
          }}
          onEdit={handleEditFromDetail}
        />
      )}

      {/* ── Edit Care Modal ── */}
      <EditCareModal
        isOpen={editCareOpen}
        onClose={() => setEditCareOpen(false)}
        care={editCareItem}
        onSave={updated => { handleSaveCare(updated); setEditCareOpen(false) }}
        onDelete={id => { setDashCares(prev => prev.filter(c => c.id !== id)); setEditCareOpen(false) }}
      />

    </div>
  )
}
