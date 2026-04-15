import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/AppLayout'

const NOTES = [
  { petId: 'pet-1', petEmoji: '🐱', petName: 'Luna', borderColor: 'var(--pal-lilac)', bg: 'var(--pal-lilac)', vet: 'Control anual · Dra. Martínez', date: '10 ene 2026', content: 'Luna en buen estado. Peso estable 4.2 kg. Revisar vacuna antirrábica próximamente. Se recomienda dieta balanceada.', badges: [{ label: 'Control', cls: 'badge-blue' }, { label: 'Dra. Martínez', cls: 'badge-gray' }] },
  { petId: 'pet-2', petEmoji: '🐶', petName: 'Toby', borderColor: 'var(--pal-sky)', bg: 'var(--pal-sky)', vet: 'Visita urgente · Dr. Sánchez', date: '04 abr 2026', content: 'Tos leve sin fiebre. Posible irritación traqueal. Mantener en observación 5-7 días. Si persiste, radiografía de tórax.', badges: [{ label: 'En observación', cls: 'badge-yellow' }, { label: 'Dr. Sánchez', cls: 'badge-gray' }] },
  { petId: 'pet-3', petEmoji: '🦜', petName: 'Kiwi', borderColor: 'var(--pal-mauve)', bg: 'var(--pal-mauve)', vet: 'Control rutinario · Dra. López', date: '20 mar 2026', content: 'Plumaje brillante, comportamiento activo. Peso 32g dentro del rango normal. Vacuna polyomavirus aplicada. Próxima revisión en 1 año.', badges: [{ label: 'Saludable', cls: 'badge-green' }, { label: 'Dra. López', cls: 'badge-gray' }] },
]

export default function NotesPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Notas</div><div className="page-subtitle">Notas veterinarias y observaciones</div></div>
        <button className="btn btn-primary" onClick={() => showToast('Nueva nota creada')}>+ Nueva nota</button>
      </div>
      <div className="grid-auto">
        {NOTES.map(n => (
          <div key={n.petId} className="card" style={{ borderLeft: `4px solid ${n.borderColor}`, cursor: 'pointer' }} onClick={() => navigate(`/pets/${n.petId}`)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{n.petEmoji}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--text)' }}>{n.petName}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{n.vet}</div>
              </div>
              <span style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginLeft: 'auto' }}>{n.date}</span>
            </div>
            <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{n.content}</p>
            <div style={{ marginTop: '.75rem', display: 'flex', gap: '.375rem', flexWrap: 'wrap' }}>
              {n.badges.map(b => <span key={b.label} className={`badge ${b.cls}`}>{b.label}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
