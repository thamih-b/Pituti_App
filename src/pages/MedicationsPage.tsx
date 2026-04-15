import { showToast } from '../components/AppLayout'

export default function MedicationsPage() {
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Medicamentos</div><div className="page-subtitle">Tratamientos activos y archivados</div></div>
        <button className="btn btn-primary" onClick={() => showToast('Formulario de medicamento')}>+ Añadir medicamento</button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Activos</div>
          {[
            { icon: '💊', bg: 'var(--warn-hl)', color: 'var(--warn)', title: 'Bravecto — Luna', sub: '1 comprimido / 3 meses · próxima: 10 jul', badge: 'badge-green', status: 'Activo' },
            { icon: '💉', bg: 'var(--blue-hl)', color: 'var(--blue)', title: 'Pipeta antipulgas — Toby', sub: '1 pipeta / mes · próxima: 30 abr', badge: 'badge-yellow', status: 'Esta semana' },
          ].map(m => (
            <div key={m.title} className="list-item">
              <div className="list-item-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
              <div className="list-item-info"><div className="list-item-title">{m.title}</div><div className="list-item-sub">{m.sub}</div></div>
              <span className={`badge ${m.badge}`}>{m.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Historial</div>
          {[
            { title: 'Amoxicilina — Luna', sub: 'Terminado — feb 2026 · 7 días' },
            { title: 'Cortisona inyectable — Toby', sub: 'Terminado — ene 2026 · 3 aplicaciones' },
          ].map(m => (
            <div key={m.title} className="list-item" style={{ opacity: .6 }}>
              <div className="list-item-icon" style={{ background: 'var(--surface-offset)', color: 'var(--text-faint)' }}>💊</div>
              <div className="list-item-info"><div className="list-item-title">{m.title}</div><div className="list-item-sub">{m.sub}</div></div>
              <span className="badge badge-gray">Terminado</span>
            </div>
          ))}
        </div>
      </div>

      {/* Adherence + schedule */}
      <div className="grid-2" style={{ marginTop: '1.125rem' }}>
        <div className="card">
          <div className="card-title">Adherencia al tratamiento</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '.5rem 0' }}>
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink: 0 }}>
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--surface-offset)" strokeWidth="9"/>
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--success)" strokeWidth="9"
                strokeDasharray="226.2" strokeDashoffset="34" strokeLinecap="round" transform="rotate(-90 45 45)"/>
              <text x="45" y="50" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="800" fontSize="20" fill="var(--text)">85%</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.625rem', flex: 1 }}>
              {[
                { label: 'BRAVECTO — LUNA', pct: 100, color: 'success', sub: 'Al día ✓', subColor: 'var(--success)' },
                { label: 'PIPETA — TOBY',   pct: 70,  color: 'warn',    sub: 'Próxima en 17 días', subColor: 'var(--warn)' },
              ].map(b => (
                <div key={b.label}>
                  <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '.3rem' }}>{b.label}</div>
                  <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width: `${b.pct}%` }} /></div>
                  <div style={{ fontSize: '.7rem', color: b.subColor, marginTop: '.2rem', fontWeight: 700 }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Próximas dosis</div>
          {[
            { icon: '💊', bg: 'var(--warn-hl)', color: 'var(--warn)', title: 'Pipeta antipulgas · Toby', date: '30 abr 2026', badge: '17d', badgeCls: 'badge-yellow' },
            { icon: '💊', bg: 'var(--blue-hl)', color: 'var(--blue)', title: 'Bravecto · Luna',           date: '10 jul 2026', badge: '89d', badgeCls: 'badge-green' },
          ].map(d => (
            <div key={d.title} className="list-item">
              <div className="list-item-icon" style={{ background: d.bg, color: d.color }}>{d.icon}</div>
              <div className="list-item-info"><div className="list-item-title">{d.title}</div><div className="list-item-sub">{d.date}</div></div>
              <span className={`badge ${d.badgeCls}`}>{d.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
