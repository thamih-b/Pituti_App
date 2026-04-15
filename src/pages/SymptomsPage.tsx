import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/AppLayout'

export default function SymptomsPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Síntomas</div><div className="page-subtitle">Observaciones de comportamiento y salud</div></div>
        <button className="btn btn-primary" onClick={() => showToast('Formulario de síntoma')}>+ Registrar síntoma</button>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Activos <span className="badge badge-red">1 en obs.</span></div>
          <div className="list-item" onClick={() => navigate('/pets/pet-2')}>
            <div className="list-item-icon" style={{ background: 'var(--err-hl)', color: 'var(--err)' }}>🌡️</div>
            <div className="list-item-info"><div className="list-item-title">Tos suave — Toby</div><div className="list-item-sub">Registrado hace 3 días · En observación</div></div>
            <div className="list-item-right"><span className="badge badge-red">Activo</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Resueltos</div>
          {[
            { icon: '🤧', title: 'Inapetencia — Luna', sub: 'Resuelto feb 2026 · 4 días' },
            { icon: '🦶', title: 'Cojera leve — Toby', sub: 'Resuelto ene 2026 · 2 días' },
          ].map(s => (
            <div key={s.title} className="list-item" style={{ opacity: .6 }}>
              <div className="list-item-icon" style={{ background: 'var(--surface-offset)', color: 'var(--text-faint)' }}>{s.icon}</div>
              <div className="list-item-info"><div className="list-item-title">{s.title}</div><div className="list-item-sub">{s.sub}</div></div>
              <span className="badge badge-gray">Resuelto</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginTop: '1.125rem' }}>
        <div className="card-title">Historial</div>
        <div className="timeline">
          {[
            { cls: 'symptom', icon: '🌡️', title: 'Tos suave · Toby', meta: 'En observación', time: 'Hace 3d' },
            { cls: 'note', icon: '✓', title: 'Inapetencia · Luna — Resuelto', meta: 'Duró 4 días', time: 'Feb 2026' },
          ].map(e => (
            <div key={e.title} className="timeline-item">
              <div className={`tl-icon ${e.cls}`}>{e.icon}</div>
              <div style={{ flex: 1 }}><div className="tl-title">{e.title}</div><div className="tl-meta">{e.meta}</div></div>
              <div className="tl-time">{e.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
