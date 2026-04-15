import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/AppLayout'

export default function VaccinesPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Vacunas</div>
          <div className="page-subtitle">Estado vacunal de todas las mascotas</div>
        </div>
        <button className="btn btn-primary" onClick={() => showToast('Formulario de vacuna')}>+ Registrar vacuna</button>
      </div>

      {/* KPI row */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        {[
          { icon: '✓', bg: 'var(--success-hl)', color: 'var(--success)', value: 6, label: 'Al día' },
          { icon: '⚠', bg: 'var(--err-hl)',     color: 'var(--err)',     value: 1, label: 'Urgente' },
          { icon: 'ℹ', bg: 'var(--gold-hl)',    color: 'var(--gold)',    value: 1, label: 'Próximas' },
          { icon: '💉', bg: 'var(--primary-hl)', color: 'var(--primary)', value: 8, label: 'Total reg.' },
        ].map(k => (
          <div key={k.label} className="kpi">
            <div className="kpi-icon" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
            <div className="kpi-value" style={{ color: k.label === 'Urgente' ? 'var(--err)' : k.label === 'Próximas' ? 'var(--gold)' : undefined }}>{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      <div className="reminder-banner">
        <span>⚠️</span>
        <div><strong style={{ fontSize: '.875rem', color: 'var(--warn)' }}>1 vacuna vence en los próximos 7 días</strong><p style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>Antirrábica de Luna — 15 abr 2026</p></div>
        <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => showToast('Agenda creada')}>Agendar</button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-title">Todas las vacunas</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Mascota</th><th>Vacuna</th><th>Última dosis</th><th>Próxima dosis</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {[
                { pet: '🐱 Luna',  vaccine: 'Antirrábica',    last: '15 abr 2024', next: '15 abr 2026', badge: 'badge-red',    status: 'URGENTE',    btn: 'Registrar', primary: true },
                { pet: '🐱 Luna',  vaccine: 'Trivalente',     last: '10 ene 2026', next: '10 ene 2027', badge: 'badge-green',  status: 'Al día',     btn: 'Ver',       primary: false },
                { pet: '🐶 Toby',  vaccine: 'Polivalente',    last: '05 feb 2026', next: '05 feb 2027', badge: 'badge-green',  status: 'Al día',     btn: 'Ver',       primary: false },
                { pet: '🐶 Toby',  vaccine: 'Antirrábica',    last: '05 feb 2025', next: 'jun 2026',    badge: 'badge-yellow', status: 'En 2 meses', btn: 'Agendar',   primary: false },
                { pet: '🦜 Kiwi',  vaccine: 'Polyomavirus',   last: '20 mar 2026', next: '20 mar 2027', badge: 'badge-green',  status: 'Al día',     btn: 'Ver',       primary: false },
              ].map((r, i) => (
                <tr key={i} onClick={() => navigate('/pets/pet-1')}>
                  <td>{r.pet}</td>
                  <td>{r.vaccine}</td>
                  <td>{r.last}</td>
                  <td>{r.next}</td>
                  <td><span className={`badge ${r.badge}`}>{r.status}</span></td>
                  <td><button className={`btn btn-sm ${r.primary ? 'btn-primary' : 'btn-ghost'}`} onClick={e => { e.stopPropagation(); showToast(r.btn + ' registrado') }}>{r.btn}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
