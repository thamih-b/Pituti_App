import { useState, useMemo } from 'react'
import { showToast } from '../components/AppLayout'
import { useCares, isDueOnDate, getNextDueDate, type CareItem } from '../context/CaresContext'
import AddCareModal  from '../components/AddCareModal'
import EditCareModal, { type CareEditData } from '../components/EditCareModal'
import CareDetailModal, { type CareDetailItem } from '../components/CareDetailModal'

const PETS_META = [
  { id:'pet-1', emoji:'🐱', name:'Luna' },
  { id:'pet-2', emoji:'🐶', name:'Toby' },
  { id:'pet-3', emoji:'🦜', name:'Kiwi' },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function CareCard({ item, done, doneState, onToggle, onClick }: {
  item: CareItem; done: number; doneState: boolean
  onToggle: () => void; onClick: () => void
}) {
  return (
    <div className={['care-card', doneState ? 'done' : ''].join(' ')}
      onClick={onClick} style={{ cursor:'pointer' }}>
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
            <div key={j} className={`care-dot ${j < done ? 'done' : ''}`} />
          ))}
        </div>
        <span>{doneState
          ? <span style={{ color:'var(--success)' }}>Hecho ✓</span>
          : `${done}/${item.total}`}
        </span>
      </div>
      <div className="care-actions" onClick={e => e.stopPropagation()}>
        <button className={`care-btn-do ${doneState ? 'done-btn' : ''}`} onClick={onToggle}>
          ✓ {doneState ? 'Hecho' : 'Registrar'}
        </button>
      </div>
    </div>
  )
}

function ScheduledRow({ item, nextDate, onClick }: {
  item: CareItem; nextDate: string; onClick: () => void
}) {
  const dateLabel = new Date(nextDate + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday:'short', day:'numeric', month:'short'
  })
  const daysFromNow = Math.round(
    (new Date(nextDate + 'T00:00:00').getTime() - new Date().setHours(0,0,0,0)) / 86400000
  )
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.875rem', padding:'.625rem .25rem',
      borderBottom:'1px solid var(--divider)', cursor:'pointer' }}
      onClick={onClick}>
      <div style={{ background:item.bg, width:36, height:36, borderRadius:'var(--r-md)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'1.1rem', flexShrink:0 }}>{item.emoji}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:'.875rem', color:'var(--text)' }}>{item.title}</div>
        <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.1rem' }}>{item.sub}</div>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <div style={{ fontSize:'.8125rem', fontWeight:800, color:'var(--primary)' }}>{dateLabel}</div>
        <div style={{ fontSize:'.65rem', color:'var(--text-faint)', marginTop:'.1rem' }}>
          {daysFromNow === 0 ? 'Hoy' : `en ${daysFromNow}d`}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CaresPage() {
  const { items, addCare, editCare, deleteCare, setCareProgress } = useCares()
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const [selPet,   setSelPet]   = useState('all')
  const [detail,   setDetail]   = useState<CareItem | null>(null)
  const [editItem, setEditItem] = useState<CareEditData | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen,  setAddOpen]  = useState(false)

  const getDone = (item: CareItem) =>
    item.doneByDate[today] ?? { done: 0, doneState: false }

  const getDailyCares = (petId: string) =>
    items.filter(i => i.petId === petId && isDueOnDate(i, today))

  const getScheduled = (petId: string) => {
    const toDate = new Date(); toDate.setDate(toDate.getDate() + 30)
    const toStr  = toDate.toISOString().split('T')[0]
    return items
      .filter(i => i.petId === petId && i.intervalDays > 1 && !isDueOnDate(i, today))
      .map(i => ({ item: i, nextDate: getNextDueDate(i, today) }))
      .filter(x => x.nextDate <= toStr)
      .sort((a, b) => a.nextDate.localeCompare(b.nextDate))
  }

  const toDetailItem = (item: CareItem): CareDetailItem => {
    const d = getDone(item)
    return { id:item.id, petId:item.petId, emoji:item.emoji, title:item.title,
      sub:item.sub, total:item.total, done:d.done, done_state:d.doneState, bg:item.bg }
  }

  const toEditData = (item: CareItem): CareEditData => ({
    id:item.id, emoji:item.emoji, title:item.title, total:item.total,
    period:item.period, quantity:item.quantity, notify:item.notify, bg:item.bg,
    time:item.time, intervalDays:item.intervalDays, recurring:item.recurring,
  })

  const visiblePets = selPet === 'all' ? PETS_META : PETS_META.filter(p => p.id === selPet)

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.125rem' }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.375rem', fontWeight:400, color:'var(--text)' }}>
            Cuidados de hoy
          </div>
          <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.2rem' }}>
            {new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' })}
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Añadir cuidado
        </button>
      </div>

      {/* Pet filter pills */}
      <div style={{ display:'flex', gap:'.375rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        {[{ id:'all', emoji:'🐾', name:'Todos' }, ...PETS_META].map(p => (
          <button key={p.id} type="button"
            style={{ display:'flex', alignItems:'center', gap:'.375rem', padding:'.4rem .875rem',
              borderRadius:'var(--r-full)',
              border:`1.5px solid ${selPet===p.id?'var(--primary)':'var(--border)'}`,
              background:selPet===p.id?'var(--primary-hl)':'var(--surface-offset)',
              color:selPet===p.id?'var(--primary)':'var(--text-muted)',
              fontWeight:700, fontSize:'.8125rem', cursor:'pointer', fontFamily:'inherit',
              minHeight:40, transition:'all 180ms' }}
            onClick={() => setSelPet(p.id)}>
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      {/* Content per pet */}
      {visiblePets.map(pet => {
        const daily     = getDailyCares(pet.id)
        const scheduled = getScheduled(pet.id)
        if (daily.length === 0 && scheduled.length === 0) return null
        const doneCount = daily.filter(c => getDone(c).doneState).length

        return (
          <div key={pet.id} style={{ marginBottom:'2rem' }}>

            {/* Pet header */}
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.875rem' }}>
              <span style={{ fontSize:'1.25rem' }}>{pet.emoji}</span>
              <span style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)' }}>{pet.name}</span>
              <span className={`badge ${doneCount===daily.length?'badge-green':'badge-yellow'}`}>
                {doneCount}/{daily.length} hoy
              </span>
            </div>

            {/* Daily care grid */}
            <div className="care-grid">
              {daily.map(item => {
                const d = getDone(item)
                return (
                  <CareCard key={item.id} item={item} done={d.done} doneState={d.doneState}
                    onToggle={() => {
                      const ns = !getDone(item).doneState
                      setCareProgress(item.id, today, ns ? item.total : 0, ns)
                      showToast(ns ? `✓ ${item.title} completado` : `↩ ${item.title} desmarcado`)
                    }}
                    onClick={() => setDetail(item)}
                  />
                )
              })}
            </div>

            {/* Scheduled section */}
            {scheduled.length > 0 && (
              <div style={{ marginTop:'1rem', background:'var(--surface)',
                border:'1.5px solid var(--border)', borderRadius:'var(--r-xl)',
                padding:'.875rem 1rem' }}>
                <div style={{ fontSize:'.75rem', fontWeight:800, color:'var(--text-muted)',
                  textTransform:'uppercase', letterSpacing:'.07em', marginBottom:'.25rem' }}>
                  📅 Próximos cuidados programados
                </div>
                {scheduled.map(({ item, nextDate }) => (
                  <ScheduledRow key={item.id} item={item} nextDate={nextDate}
                    onClick={() => setDetail(item)} />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Modals ── */}

      {detail && (
        <CareDetailModal
          item={toDetailItem(detail)}
          onClose={() => setDetail(null)}
          onToggle={(id, newDone, newState) => {
            setCareProgress(id, today, newDone, newState)
            const u = items.find(i => i.id === id)
            if (u) setDetail({ ...u })
          }}
          onEdit={di => {
            setDetail(null)
            const item = items.find(i => i.id === di.id)
            if (item) { setEditItem(toEditData(item)); setEditOpen(true) }
          }}
        />
      )}

      <AddCareModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={d => {
          addCare({
            petId: d.petId, emoji: d.emoji, title: d.title,
            sub: `${d.total}× ${d.period==='day'?'día':'semana'}${d.quantity?' · '+d.quantity:''}`,
            total: d.total, period: d.period, quantity: d.quantity, notify: d.notify,
            bg: '', time: d.time ?? '',
            intervalDays: d.intervalDays ?? 1,
            recurring: (d as any).recurring ?? true,
            startDate: today,
          })
        }}
      />

      <EditCareModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        care={editItem}
        onSave={updated => {
          const item = items.find(i => i.id === updated.id)
          if (!item) return
          editCare({
            ...item,
            emoji: updated.emoji, title: updated.title, total: updated.total,
            period: updated.period, quantity: updated.quantity ?? '', notify: updated.notify,
            sub: `${updated.total}× ${updated.period==='day'?'día':'semana'}${updated.quantity?' · '+updated.quantity:''}`,
            time: updated.time, intervalDays: updated.intervalDays ?? 1,
            recurring: (updated as any).recurring ?? true,
          })
          showToast(`${updated.emoji} ${updated.title} actualizado`)
          setEditOpen(false)
        }}
        onDelete={id => { deleteCare(id); setEditOpen(false); showToast('Cuidado eliminado') }}
      />
    </div>
  )
}
