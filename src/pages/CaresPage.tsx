import { useState } from 'react'
import { showToast } from '../components/AppLayout'

interface CareItemData {
  id: string; petId: string; emoji: string; title: string; sub: string
  total: number; done: number; done_state: boolean; bg: string
}

const INITIAL_CARES: CareItemData[] = [
  // Luna
  { id: 'l-feed',  petId: 'pet-1', emoji: '🍽️', title: 'Alimentación', sub: '2× día · 80g', total: 2, done: 1, done_state: false, bg: 'linear-gradient(135deg,#FFF3DC,#FFE0A0)' },
  { id: 'l-water', petId: 'pet-1', emoji: '💧', title: 'Agua',          sub: '1× día',       total: 1, done: 1, done_state: true,  bg: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)' },
  { id: 'l-arena', petId: 'pet-1', emoji: '🧹', title: 'Caja de arena', sub: 'Diaria',       total: 1, done: 1, done_state: true,  bg: 'linear-gradient(135deg,#FFF0E0,#FFD8B0)' },
  // Toby
  { id: 't-feed',  petId: 'pet-2', emoji: '🍽️', title: 'Alimentación', sub: '3× día · 200g', total: 3, done: 1, done_state: false, bg: 'linear-gradient(135deg,#FFF3DC,#FFE0A0)' },
  { id: 't-water', petId: 'pet-2', emoji: '💧', title: 'Agua',          sub: '1× día',        total: 1, done: 1, done_state: true,  bg: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)' },
  { id: 't-walk',  petId: 'pet-2', emoji: '🏃', title: 'Paseo',         sub: '2× día · quintal', total: 2, done: 0, done_state: false, bg: 'linear-gradient(135deg,#E8FFE8,#B8F0B8)' },
  // Kiwi
  { id: 'k-feed',  petId: 'pet-3', emoji: '🍽️', title: 'Alimentación', sub: '2× día · 10g semillas', total: 2, done: 2, done_state: true,  bg: 'linear-gradient(135deg,#FFF3DC,#FFE0A0)' },
  { id: 'k-water', petId: 'pet-3', emoji: '💧', title: 'Agua',          sub: '1× día · gaiola',      total: 1, done: 1, done_state: true,  bg: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)' },
  { id: 'k-cage',  petId: 'pet-3', emoji: '🏠', title: 'Limpieza gaiola', sub: 'Diária',              total: 1, done: 1, done_state: true,  bg: 'linear-gradient(135deg,#FFF0E0,#FFD8B0)' },
]

const PETS_META = [
  { id: 'pet-1', emoji: '🐱', name: 'Luna', color: 'var(--pal-lilac)', alertLabel: '1 urgente', alertCls: 'badge-yellow' },
  { id: 'pet-2', emoji: '🐶', name: 'Toby', color: 'var(--pal-sky)',   alertLabel: '2 urgentes', alertCls: 'badge-red'  },
  { id: 'pet-3', emoji: '🦜', name: 'Kiwi', color: 'var(--pal-mauve)', alertLabel: 'Todo al día', alertCls: 'badge-green' },
]

interface CareCardProps { item: CareItemData; onToggle: (id: string) => void }
function CareCard({ item, onToggle }: CareCardProps) {
  return (
    <div className={['care-card', item.done_state ? 'done' : ''].join(' ')}>
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
        <span>{item.done_state ? <span style={{ color: 'var(--success)' }}>Hecho ✓</span> : `${item.done}/${item.total}`}</span>
      </div>
      <div className="care-actions">
        <button className={`care-btn-do ${item.done_state ? 'done-btn' : ''}`} onClick={() => onToggle(item.id)}>
          ✓ {item.done_state ? 'Hecho' : 'Registrar'}
        </button>
        <button className="care-btn-cfg" onClick={() => showToast('Configura este cuidado')}>⚙️</button>
      </div>
    </div>
  )
}

export default function CaresPage() {
  const [cares, setCares] = useState<CareItemData[]>(INITIAL_CARES)
  const [filter, setFilter] = useState<string | null>(null)

  const toggle = (id: string) => {
    setCares(prev => prev.map(c => c.id !== id ? c : { ...c, done_state: !c.done_state, done: !c.done_state ? c.total : Math.max(0, c.done - 1) }))
    showToast('Cuidado registrado ✓')
  }

  const totalDone = cares.filter(c => c.done_state).length
  const total = cares.length

  const visibleCares = filter ? cares.filter(c => c.petId === filter) : cares
  const visiblePets = filter ? PETS_META.filter(p => p.id === filter) : PETS_META

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Cuidados diarios</div><div className="page-subtitle">Rutina de todas las mascotas · hoy</div></div>
        <button className="btn btn-primary" onClick={() => showToast('Formulario de cuidado')}>+ Añadir cuidado</button>
      </div>

      {/* Pet filter pills */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button className={`btn btn-sm ${filter === null ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: 'var(--r-full)' }} onClick={() => setFilter(null)}>Todas</button>
        {PETS_META.map(p => (
          <button key={p.id} className={`btn btn-sm ${filter === p.id ? 'btn-primary' : 'btn-secondary'}`} style={{ borderRadius: 'var(--r-full)' }} onClick={() => setFilter(p.id)}>
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--sh-sm)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{totalDone}<span style={{ fontSize: '.875rem', color: 'var(--text-muted)', fontWeight: 600 }}> / {total}</span></div>
          <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>completados</div>
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div className="progress-wrap" style={{ height: 10 }}>
            <div className="progress-bar" style={{ width: `${Math.round(totalDone / total * 100)}%`, transition: 'width .5s' }} />
          </div>
          <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.375rem' }}>{Math.round(totalDone / total * 100)}% del día completado</div>
        </div>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          {[
            { val: cares.filter(c => !c.done_state && c.petId === 'pet-1').length + cares.filter(c => !c.done_state && c.petId === 'pet-2').length, label: 'Urgentes', color: 'var(--err)' },
            { val: cares.filter(c => !c.done_state).length, label: 'Pendientes', color: 'var(--warn)' },
            { val: totalDone, label: 'Hechos', color: 'var(--success)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '.65rem', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-pet sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {visiblePets.map(pet => (
          <div key={pet.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '.875rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: pet.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{pet.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>{pet.name}</div>
              <span className={`badge ${pet.alertCls}`}>⚠ {pet.alertLabel}</span>
            </div>
            <div className="care-grid">
              {visibleCares.filter(c => c.petId === pet.id).map(c => <CareCard key={c.id} item={c} onToggle={toggle} />)}
              <div className="care-card" style={{ borderStyle: 'dashed', opacity: .65, justifyContent: 'center', alignItems: 'center', minHeight: 140, cursor: 'pointer', textAlign: 'center' }}
                onClick={() => showToast('Formulario de cuidado para ' + pet.name)}
                onMouseOver={e => (e.currentTarget.style.opacity = '1')}
                onMouseOut={e => (e.currentTarget.style.opacity = '.65')}
              >
                <div style={{ fontSize: '1.75rem' }}>＋</div>
                <div style={{ fontSize: '.8rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: '.375rem' }}>Añadir cuidado</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
